export type ActionResponse = {
  success: boolean;
  invalid?: boolean;
};

export abstract class BaseAction {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async execute(payload: unknown): Promise<ActionResponse> {
    throw new Error('Method not implemented.');
  }
}
