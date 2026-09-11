import imageUrlBuilder from '@sanity/image-url';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, isSanityConfigured, projectId } from './env';

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true,
    })
  : null;

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null;

export function urlForImage(source: unknown) {
  if (!builder || !source) {
    return null;
  }
  return builder.image(source as never);
}
