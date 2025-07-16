import { Dwani } from './dwani';
import { DwaniConfig } from './config/dwaniConfig';
export * from './interfaces/requests';
export * from './config/dwaniConfig';
export * from './utils/language';
export { Dwani } from './dwani';

export function init(config?: DwaniConfig) {
  return new Dwani(config);
}

export default init;