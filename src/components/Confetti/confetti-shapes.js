// @flow
import {
    format as formatColor,
    mixWithBlack,
    mixWithWhite,
    parse as parseColor,
} from "../../shared-styles-package/color.js";

// Creates an actual <img> element. This is needed to paint a shape into an
// HTML canvas.
const createImageElement = svgString => {
    // window.btoa creates a base64 encoded string. Combined with the data
    // prefix, it can be used as an image `src`.
    const base64ShapeString =
        "data:image/svg+xml;base64," + window.btoa(svgString);

    const imageElement = new Image();
    imageElement.src = base64ShapeString;

    return imageElement;
};

// Each of the following shape factories returns a string representation of
// an SVG, which can be used to create an <img> element.
// TODO (josh): See if there's a way to use React components instead, just
// need to find a client-side way to get a string representation of a
// component's rendered result.
const circleShapeFactory = ({size = 15, fill}) => `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 10"
        width="${size}"
        height="${size}"
    >
        <circle
            cx="5"
            cy="5"
            r="5"
            fill="${formatColor(fill)}"
        />
    </svg>
`;

const triangleShapeFactory = ({size = 16, fill}) => `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 10 10"
        width="${size}"
        height="${size}"
    >
        <polygon
            fill="${formatColor(fill)}"
            points="0 10 5 0 10 10"
        />
    </svg>
`;

const rectangleShapeFactory = ({width = 6, height = 12, fill}) => `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 ${width} ${height}"
        width="${width}"
        height="${height}"
    >
        <rect
            x="0"
            y="0"
            width="${width}"
            height="${height}"
            fill="${formatColor(fill)}"
        />
    </svg>
`;

const zigZagShapeFactory = ({size = 20, fill}) => `
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 23.74 92.52"
        width="${size}"
        height="${size * 4}"
    >
        <polygon
            fill="${formatColor(fill)}"
            points="17.08 31.49 3.56 29.97 10.22 0 23.74 1.52 17.08 31.49"
        />
        <polygon
            fill="${formatColor(fill)}"
            points="13.53 92.52 0 91 6.66 61.03 20.19 62.55 13.53 92.52"
        />
        <polygon
            fill="${formatColor(mixWithWhite(fill, 0.35))}"
            points="20.19 62.55 6.66 61.03 3.56 29.97 17.08 31.49 20.19 62.55"
        />
    </svg>
`;

type ShapeProps = {
    fill?: string,
    backsideDarkenAmount?: number,
    size?: number,
    width?: number,
    height?: number,
};

// Our base export, this generalized helper is used to create image tags
// from the props provided.
// NOTE: You probably want to use one of the preloaded helpers below
// (eg. createCircle).
export const createShape = (shape: string) => (
    {fill = "#000000", backsideDarkenAmount = 0.25, ...args}: ShapeProps = {},
) => {
    // Convert fill to RGB
    const fillRgb = parseColor(fill);

    // Get the factory for the provided shape
    let shapeFactory;
    switch (shape) {
        case "circle": {
            shapeFactory = circleShapeFactory;
            break;
        }
        case "triangle": {
            shapeFactory = triangleShapeFactory;
            break;
        }
        case "rectangle": {
            shapeFactory = rectangleShapeFactory;
            break;
        }
        case "zigZag": {
            shapeFactory = zigZagShapeFactory;
            break;
        }
        default:
            throw new Error("Unrecognized shape passed to `createShape`");
    }

    // Create a front and back side, where the back is identical but with a
    // darker colour.
    const backColor = mixWithBlack(fillRgb, backsideDarkenAmount);

    const frontSvgString = shapeFactory({fill: fillRgb, ...args});
    const backSvgString = shapeFactory({fill: backColor, ...args});

    // Create and return image elements for both sides.
    return {
        front: createImageElement(frontSvgString),
        back: createImageElement(backSvgString),
    };
};

export const createCircle = createShape("circle");
export const createTriangle = createShape("triangle");
export const createRectangle = createShape("rectangle");
export const createZigZag = createShape("zigZag");