# AdvBackground

An advanced background control component that supports solid colors, gradients, images, and videos. It includes responsive image controls (position, attachment, repeat, size).

## Props

- `name` (String, optional): The label for the background control. Default: `'Background'`.
- `value` (Object, required): The current background settings object `{ type, color, gradient, img, video }`.
- `onChange` (Function, required): The callback to fire when background settings change.
- `isVideo` (Boolean, optional): Whether to include the video background tab. Default: `false`.
- `device` (String, optional): The current device type (Desktop, Tablet, Mobile). Injected via `withSelect`.

## Usage

```jsx
import { AdvBackground } from '../Components';

// Usage inside InspectorControls
<AdvBackground
	name="Section Background"
	value={ attributes.background }
	onChange={ (val) => setAttributes({ background: val }) }
	isVideo={ true }
/>
```

## Attributes
"background":{
	"type":"image",
	"color":"",
	"gradient":{
		"type":"radial",
		"radialType":"ellipse",
		"colors":[
			{
			"color":"#146EF5",
			"position":"0"
			},
			{
			"color":"#FF7A00",
			"position":"80"
			}
		],
		"centerPositions":{
			"x":50,
			"y":50
		},
		"angel":90
	},
	"img":{
		"desktop":{
			"position":"center center",
			"xPosition":0,
			"yPosition":0,
			"attachment":"",
			"repeat":"no-repeat",
			"size":"",
			"customSize":"0px"
		},
		"tablet":{
			"position":"center center",
			"xPosition":0,
			"yPosition":0,
			"attachment":"",
			"repeat":"no-repeat",
			"size":"",
			"customSize":"0px"
		},
		"mobile":{
			"position":"center center",
			"xPosition":0,
			"yPosition":0,
			"attachment":"",
			"repeat":"no-repeat",
			"size":"",
			"customSize":"0px"
		}
	},
	"video":{
		"url":"",
		"loop":false
	},
	"transition":0.3
}