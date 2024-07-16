export class ModelManagerService {
    initialize = jest.fn().mockResolvedValue(undefined);
    getData = jest.fn().mockResolvedValue({});
    addListener = jest.fn();
    removeListener = jest.fn();
  }