import { HALResponse } from './response';
import { Response } from '../response';

/**
 * Representation of a link in a HAL document
 */
export interface Link {
  /** The href for the link */
  href: string;
  /** Whether the link is templated or not */
  templated?: boolean;
}

/** The type bound for the body of a HAL document */
export type HALBody = Record<string, any>;

/**
 * Representation of a HAL document
 */
export class HAL<T extends HALBody> {
  /** The links in the document */
  private links: { [rel: string]: Link[] };

  /** The body of this document */
  private body: T;

  /**
   * Construct the HAL document
   * @param body The body of the document
   */
  constructor(body: T) {
    this.links = {};
    this.body = body;
  }

  /**
   * Add a new link to the HAL document.
   * @param rel The link relation of the link
   * @param link The actual link
   */
  withLink(rel: string, link: Link): HAL<T> {
    if (this.links[rel] === undefined) {
      this.links[rel] = [];
    }
    this.links[rel].push(link);
    return this;
  }

  /**
   * Actually generate the response for the client
   * @param input The input request
   * @returns The output response
   */
  response(): Response {
    const responseLinks: { [rel: string]: Link | Link[] } = {};

    Object.entries(this.links).forEach(([rel, links]) => {
      if (links.length == 1) {
        responseLinks[rel] = links[0];
      } else if (links.length > 1) {
        responseLinks[rel] = links;
      }
    });

    const responseBody = {
      ...this.body,
      _links: responseLinks,
    };

    return new HALResponse(responseBody);
  }
}
