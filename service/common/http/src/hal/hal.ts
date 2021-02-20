import { AbstractRespondable } from '../response';

/**
 * Shape of a link in a HAL document
 */
export interface Link {
  readonly href: string;
  readonly templated?: boolean;
}

/**
 * Shape of a HAL document
 */
export interface HalDocument {
  _links: { [rel: string]: Link | Link[] };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

/**
 * Respondable representing a HAL document
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class HAL<T extends Record<string, any>> extends AbstractRespondable<HalDocument> {
  /** The payload of the document */
  private readonly payload: T;

  /** Any links for the document */
  private readonly links: { [rel: string]: Link[] };

  /**
   * Construct the payload
   * @param payload The payload of the document
   */
  constructor(payload: T) {
    super();

    this.payload = payload;
    this.links = {};

    this.withHeader('content-type', 'application/hal+json');
  }

  /**
   * Add a link to the document
   * @param rel The link relation
   * @param link The link to add
   */
  withLink(rel: string, link: Link): this {
    if (this.links[rel] === undefined) {
      this.links[rel] = [];
    }
    this.links[rel].push(link);
    return this;
  }

  body(): HalDocument {
    const links: { [rel: string]: Link | Link[] } = {};

    Object.entries(this.links).forEach(([rel, l]) => {
      if (l.length === 1) {
        links[rel] = l[0];
      } else if (l.length > 1) {
        links[rel] = l;
      }
    });

    return {
      _links: links,
      ...this.payload,
    };
  }
}
