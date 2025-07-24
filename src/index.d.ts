import { Options } from './common/fluent-api';
import { ComponentSelectorBuilder } from './fluent-api';

/**
 * Creates and returns a ComponentSelectorBuilder instance for architectural analysis
 * @param options - Configuration options for the application
 * @returns ComponentSelectorBuilder instance
 */
export declare const app: (options?: Options) => ComponentSelectorBuilder;

// Re-export the main fluent API classes
export { ComponentSelectorBuilder } from './fluent-api';
