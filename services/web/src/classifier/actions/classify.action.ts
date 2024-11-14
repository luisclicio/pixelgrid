import {
  pipeline,
  RawImage,
  type ImageClassificationPipeline,
  type ObjectDetectionPipeline,
} from '@huggingface/transformers';

import { BaseAction } from './base.action.js';
import { storage } from '@/services/storage';
import { prisma } from '@/services/db.js';

export type ClassifyActionPayload = {
  id: string;
  key: string;
};

type ClassifyActionGetTagsResponse = Record<
  'detector' | 'classifier',
  Array<{ score: number; tag: string }> | null
>;

export class ClassifyAction extends BaseAction {
  private logger = console;

  private detector!: ObjectDetectionPipeline;
  private classifier!: ImageClassificationPipeline;

  private possibleTagsMap: Map<string, string> = new Map();

  constructor() {
    super();
    this.setup();
  }

  private async setup() {
    this.detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
    this.classifier = await pipeline(
      'image-classification',
      'Xenova/vit-base-patch16-224'
    );

    const possibleTags = await prisma.tag.findMany({
      where: {
        ownerId: null,
      },
      select: {
        id: true,
        key: true,
      },
    });

    possibleTags.forEach((tag) => {
      this.possibleTagsMap.set(tag.key, tag.id);
    });
  }

  async execute(payload: ClassifyActionPayload) {
    this.logger.debug('Classifying image', payload);

    try {
      const imageBytes = await storage.getBytes(payload.key);
      const image = await RawImage.fromBlob(new Blob([imageBytes]));

      const foundTagsResponse = await this.getTags(image);
      const foundTags = [
        ...(foundTagsResponse.detector || []),
        ...(foundTagsResponse.classifier || []),
      ].map(({ tag }) => tag);

      await prisma.image.update({
        where: {
          id: payload.id,
        },
        data: {
          tags: {
            connect: foundTags.map((tag) => ({
              id: this.possibleTagsMap.get(tag),
            })),
          },
        },
      });

      return {
        success: true,
        invalid: false,
      };
    } catch (error) {
      this.logger.error(error, 'Failed to classify image');
      throw error;
    }
  }

  async getTags(image: RawImage): Promise<ClassifyActionGetTagsResponse> {
    const results: ClassifyActionGetTagsResponse = {
      detector: null,
      classifier: null,
    };

    try {
      const detectorOutput = await this.detector(image, {
        threshold: 0.8,
        percentage: true,
      });

      if (detectorOutput.length > 0) {
        results['detector'] = (
          detectorOutput as Array<{
            score: number;
            label: string;
          }>
        ).map(({ score, label }) => ({
          score,
          tag: label,
        }));
      }

      const classifierOutput = await this.classifier(image, { top_k: 2 });

      if (classifierOutput.length > 0) {
        results['classifier'] = (
          classifierOutput as Array<{
            score: number;
            label: string;
          }>
        ).map(({ score, label }) => ({
          score,
          tag: label,
        }));
      }
    } catch (error) {
      console.error(error);
    }

    return results;
  }
}
