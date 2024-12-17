'use server';

import type { ServerActionResult, ChangeResourceAccess } from '@/types';
import { updateAlbum } from './albums';
import { updateImage } from './images';

export async function changeResourceAccess(
  resource: ChangeResourceAccess
): Promise<ServerActionResult> {
  try {
    if (resource.type === 'album') {
      await updateAlbum(resource.id, {
        accessGrantType: resource.accessGrantType,
      });
    } else if (resource.type === 'image') {
      await updateImage(resource.id, {
        accessGrantType: resource.accessGrantType,
      });
    }

    return {
      status: 'SUCCESS',
    };
  } catch (error) {
    console.error(error);

    return {
      status: 'ERROR',
    };
  }
}
