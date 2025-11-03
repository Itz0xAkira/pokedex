/**
 * Common Shared Type Definitions
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}

/**
 * Page size options for pagination
 */
export type PageSize = 10 | 20 | 50;

/**
 * Height class options
 */
export type HeightClass = 'small' | 'medium' | 'large';

/**
 * Weight class options
 */
export type WeightClass = 'light' | 'medium' | 'heavy';

/**
 * Generic callback function type
 */
export type Callback<T = void> = (value: T) => void;

/**
 * Generic event handler type
 */
export type EventHandler<T = React.ChangeEvent<HTMLInputElement>> = (event: T) => void;

