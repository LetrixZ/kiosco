import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import type { Product } from './models/Product';

export const itemList: Writable<Product[]> = writable([]);