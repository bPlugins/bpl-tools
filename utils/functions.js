
import { produce } from 'immer';

export const getBoxValue = object => Object.values(object).join(' ');

export const getImageSizes = (image, imageSizes) => {
    if (!image) return [];
    let options = [];
    const sizes = image.media_details.sizes;

    for (const key in sizes) {
        const imageSize = imageSizes.find((s) => s.slug === key);
        if (imageSize) {
            options.push({ label: imageSize.name, value: sizes[key].source_url });
        }
    }
    return options;
}

export const tabController = () => {
    setTimeout(() => {
        const panelBodies = document.querySelectorAll('.bPlPanelBody:not(.itemPanelBody) > h2 > button');

        panelBodies.forEach((item) => {
            item.addEventListener('click', clickEveryItem);
        });

        function clickEveryItem() {
            this.removeEventListener('click', clickEveryItem);

            panelBodies.forEach((item) => {
                if (
                    item.getAttribute('aria-expanded') === 'true' &&
                    !item.isEqualNode(this)
                ) {
                    item.click();
                }
            });

            setTimeout(() => {
                this.addEventListener('click', clickEveryItem);
            }, 500);
        }
    }, 500);
}

export const updateData = (attr, value, ...props) => {
    if (props.length === 0) {
        return value;
    }
    const [currentProp, ...remainingProps] = props;
    if (remainingProps.length === 0) {
        return produce(attr, (draft) => {
            if (
                Array.isArray(draft[currentProp]) &&
                (draft === null || draft === undefined)
            ) {
                draft = {};
            }
            draft[currentProp] = value;
        });
    }
    return produce(attr, (draft) => {
        if (draft === null || draft === undefined) {
            draft = {};
        }
        if (!Object.prototype.hasOwnProperty.call(draft, currentProp)) {
            draft[currentProp] = {};
        }
        draft[currentProp] = updateData(
            draft[currentProp],
            value,
            ...remainingProps
        );
    });
}

export const updateAttributes = (attributes, setAttributes) => {
    return (object, val, ...props) => {
        setAttributes({ [object]: updateData(attributes[object], val, ...props) });
    };
};

export const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    }
}

export const getRandomColor = () => {
    return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

export const randomNumber = (number) => parseInt(Math.random() * number);

export class MimeTypeChecker {
    // Common MIME types mapping

    static get mimeTypes() {
        return {
            // Images
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'bmp': 'image/bmp',
            'ico': 'image/x-icon',

            // Documents
            'pdf': 'application/pdf',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt': 'text/plain',
            'csv': 'text/csv',

            // Audio/Video
            'mp3': 'audio/mpeg',
            'wav': 'audio/wav',
            'ogg': 'audio/ogg',
            'mp4': 'video/mp4',
            'webm': 'video/webm',
            'avi': 'video/x-msvideo',
            'mov': 'video/quicktime',

            // Archives
            'zip': 'application/zip',
            'rar': 'application/x-rar-compressed',
            'tar': 'application/x-tar',
            'gz': 'application/gzip',

            // Code
            'js': 'application/javascript',
            'css': 'text/css',
            'html': 'text/html',
            'json': 'application/json',
            'xml': 'application/xml'
        };
    }

    // Check if a file has a valid MIME type (now handles both string and array)
    static isValidMimeType(file, allowedTypes = []) {
        if (!file) return false;

        const fileType = this.getMimeTypeFromFile(file);
        if (!fileType) return false;

        // Convert single string to array for consistent processing
        const typesArray = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

        if (typesArray.length === 0) return true;

        return typesArray.some(allowedType => {
            if (allowedType.includes('*')) {
                // Handle wildcard types like 'image/*'
                const baseType = allowedType.split('/*')[0];
                return fileType.startsWith(baseType);
            }
            return fileType === allowedType;
        });
    }

    // Get MIME type from file extension
    static getMimeTypeFromExtension(filename) {
        if (!filename) return null;

        const extension = filename.split('.').pop().toLowerCase();
        return this.mimeTypes[extension] || null;
    }

    // Get MIME type from File object
    static getMimeTypeFromFile(file) {
        if (file instanceof File || file instanceof Blob) {
            return file.type || this.getMimeTypeFromExtension(file.name);
        }
        return this.getMimeTypeFromExtension(file);
    }

    // Check if file is an image
    static isImage(file) {
        const mimeType = this.getMimeTypeFromFile(file);
        return mimeType ? mimeType.startsWith('image/') : false;
    }

    // Check if file is a video
    static isVideo(file) {
        const mimeType = this.getMimeTypeFromFile(file);
        return mimeType ? mimeType.startsWith('video/') : false;
    }

    // Check if file is an audio file
    static isAudio(file) {
        const mimeType = this.getMimeTypeFromFile(file);
        return mimeType ? mimeType.startsWith('audio/') : false;
    }

    // Check if file is a document
    static isDocument(file) {
        const mimeType = this.getMimeTypeFromFile(file);
        return mimeType ? (
            mimeType.startsWith('application/') ||
            mimeType.startsWith('text/') ||
            mimeType.includes('word') ||
            mimeType.includes('excel') ||
            mimeType.includes('powerpoint') ||
            mimeType.includes('pdf')
        ) : false;
    }

    // Validate file against specific MIME types
    // Validate file against specific MIME types (updated to handle string/array)
    static validateFile(file, options = {}) {
        const {
            allowedTypes = [],
            maxSize = Infinity,
            minSize = 0
        } = options;

        const errors = [];

        // Convert allowedTypes to array if it's a string
        const typesArray = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

        // Check MIME type
        if (typesArray.length > 0 && !this.isValidMimeType(file, typesArray)) {
            const allowedTypesString = typesArray.join(', ');
            errors.push(`File type not allowed. Allowed types: ${allowedTypesString}`);
        }

        // Check file size (only if it's a File/Blob object)
        if (file instanceof File || file instanceof Blob) {
            if (file.size > maxSize) {
                errors.push(`File size too large. Maximum size: ${this.formatBytes(maxSize)}`);
            }

            if (file.size < minSize) {
                errors.push(`File size too small. Minimum size: ${this.formatBytes(minSize)}`);
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            mimeType: this.getMimeTypeFromFile(file),
            size: file instanceof File || file instanceof Blob ? file.size : null
        };
    }

    // Helper to format bytes
    static formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    static addMimeType(extension, mimeType) {
        const types = this.mimeTypes;
        types[extension.toLowerCase()] = mimeType;
    }

    // Add an instance property that references the static methods
    static get helpers() {
        return {
            validateFile: this.validateFile.bind(this),
            isValidMimeType: this.isValidMimeType.bind(this),
            isImage: this.isImage.bind(this),
            isVideo: this.isVideo.bind(this),
            isAudio: this.isAudio.bind(this),
            isDocument: this.isDocument.bind(this),
            getMimeTypeFromFile: this.getMimeTypeFromFile.bind(this),
            getMimeTypeFromExtension: this.getMimeTypeFromExtension.bind(this),
            addMimeType: this.addMimeType.bind(this)
        };
    }
}


//-------- Sanitize SVG ----------//
export class SVGSanitizer {
    constructor(options = {}) {
        this.defaultOptions = {
            allowedTags: [
                'svg', 'g', 'path', 'rect', 'circle', 'ellipse', 'line', 'polyline',
                'polygon', 'text', 'tspan', 'defs', 'clipPath', 'mask', 'linearGradient',
                'radialGradient', 'stop', 'style', 'title', 'desc'
            ],
            allowedAttributes: [
                'id', 'class', 'style', 'transform', 'd', 'x', 'y', 'width', 'height',
                'cx', 'cy', 'r', 'rx', 'ry', 'points', 'x1', 'y1', 'x2', 'y2',
                'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin',
                'opacity', 'fill-opacity', 'stroke-opacity', 'viewBox', 'preserveAspectRatio',
                'xmlns', 'xmlns:xlink'
            ],
            allowedProtocols: ['http', 'https', 'data'],
            removeScripts: true,
            removeEvents: true,
            removeExternalResources: true,
            sanitizeStyle: true
        };

        this.options = { ...this.defaultOptions, ...options };
    }

    sanitize(svgString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgString, 'image/svg+xml');

        this.removeScripts(doc);
        this.sanitizeElements(doc);

        const serializer = new XMLSerializer();
        return serializer.serializeToString(doc.documentElement);
    }

    removeScripts(doc) {
        if (this.options.removeScripts) {
            const scripts = doc.querySelectorAll('script');
            scripts.forEach(script => script.remove());

            // Also remove script elements in other namespaces
            const allElements = doc.querySelectorAll('*');
            allElements.forEach(el => {
                if (el.tagName.toLowerCase().includes('script')) {
                    el.remove();
                }
            });
        }
    }

    sanitizeElements(doc) {
        const allElements = doc.querySelectorAll('*');

        allElements.forEach(element => {
            const tagName = element.tagName.toLowerCase();

            // Remove disallowed tags
            if (!this.options.allowedTags.includes(tagName)) {
                element.remove();
                return;
            }

            this.sanitizeAttributes(element);
        });
    }

    sanitizeAttributes(element) {
        const attributes = Array.from(element.attributes);

        attributes.forEach(attr => {
            const attrName = attr.name.toLowerCase();
            const attrValue = attr.value;

            // Remove event handlers
            if (this.options.removeEvents && attrName.startsWith('on')) {
                element.removeAttribute(attrName);
                return;
            }

            // Handle external resources
            if (this.options.removeExternalResources) {
                if ((attrName === 'href' || attrName === 'xlink:href') &&
                    !this.isAllowedUrl(attrValue)) {
                    element.removeAttribute(attrName);
                    return;
                }
            }

            // Remove disallowed attributes
            const baseAttrName = attrName.replace('xlink:', '');
            if (!this.options.allowedAttributes.includes(baseAttrName)) {
                element.removeAttribute(attrName);
                return;
            }

            // Sanitize style attribute
            if (attrName === 'style' && this.options.sanitizeStyle) {
                this.sanitizeStyleAttribute(element, attrValue);
            }
        });
    }

    isAllowedUrl(url) {
        if (url.startsWith('data:') || url.startsWith('#')) {
            return true;
        }

        try {
            const parsedUrl = new URL(url);
            return this.options.allowedProtocols.includes(parsedUrl.protocol.replace(':', ''));
        } catch {
            return false;
        }
    }

    sanitizeStyleAttribute(element, styleValue) {
        // Remove dangerous CSS properties and values
        const safeStyle = styleValue
            .replace(/expression\(|javascript:|url\(javascript:/gi, '')
            .replace(/behavior\s*:/gi, '')
            .replace(/binding\s*:/gi, '');

        element.setAttribute('style', safeStyle);
    }
}