# Typography

Typography is used to set element typography(Font Family, Font Weight, Font Size, Font Style, Text Transform, Text Decoration, Line Height, Letter Space).


## Table of contents

1. [Usage](#usage)
2. [Options](#options)

<br />

## Usage

### block.json
Add an attribute in `block.json` file.

```json
"typography": {
	"type": "object",
	"default": {
		"fontSize": {
			"desktop": "16px"
		}
	}
}
```

<br />

### Settings.js

```jsx
import { Typography } from '../../Components';

const { typography } = attributes;

return <Typography label={__('Label', 'text-domain')} value={typography} onChange={val => setAttributes({ typography: val })} defaults={{ fontSize: 16 }} />
```

More props in [Options](#options).

<br />

### Style.js
```jsx
import { getTypoCSS } from '../../Components/utils/getCSS';

const { typography } = attributes;

<style dangerouslySetInnerHTML={{
__html: `
	${getTypoCSS('', typography)?.googleFontLink}
	${getTypoCSS('selector', typography)?.styles}
`
}}/>
```

<br />

### style.php
In order to use typography object in `php`. You have to create a function like `getTypoCSS`.

```php
function isValidCSS($property, $value) {
	if ( empty( $value ) && $value !== '0' && $value !== 0 ) {
		return '';
	}
	return "$property: $value;";
}
function checkUnit( $size ) {
	$value = (string)$size;
	$units = ['px', 'em', 'rem', '%', 'vh', 'vw'];

	foreach ( $units as $unit ) {
		if ( substr( $value, -strlen( $unit ) ) === $unit ) {
			return $value;
		}
	}

	if ( is_numeric( $size ) ) {
		return $value . 'px';
	}

	return '';
}

function getTypoCSS( $selector, $typo, $isFamily = true ) {
	extract( $typo );
	$fontFamily = $fontFamily ?? 'Default';
	$fontCategory = $fontCategory ?? 'sans-serif';
	$fontVariant = $fontVariant ?? 400;
	$fontWeight = $fontWeight ?? '';
	$isUploadFont = $isUploadFont ?? true;
	$fontSize = $fontSize ?? [ 'desktop' => null, 'tablet' => null, 'mobile' => null ];
	$fontStyle = $fontStyle ?? '';
	$textTransform = $textTransform ?? '';
	$textDecoration = $textDecoration ?? '';
	$lineHeight = $lineHeight ?? '';
	$letterSpace = $letterSpace ?? '';

	$isEmptyFamily = !$isFamily || !$fontFamily || 'Default' === $fontFamily;
	$desktopFontSize = $fontSize['desktop'] ?? $fontSize;
	$tabletFontSize = $fontSize['tablet'] ?? $desktopFontSize;
	$mobileFontSize = $fontSize['mobile'] ?? $tabletFontSize;

	$tabBreakpoint = '@media only screen and (max-width: 1024px)';
	$mobileBreakpoint = '@media only screen and (max-width: 640px)';

	$styles = 
		($isEmptyFamily ? '' : "font-family: '$fontFamily', $fontCategory;") .
		self::isValidCSS('font-weight', $fontWeight) .
		self::isValidCSS('font-size', self::checkUnit($desktopFontSize)) .
		self::isValidCSS('font-style', $fontStyle) .
		self::isValidCSS('text-transform', $textTransform) .
		self::isValidCSS('text-decoration', $textDecoration) .
		self::isValidCSS('line-height', $lineHeight) .
		self::isValidCSS('letter-spacing', $letterSpace);

	// Google font link
	if (!$fontVariant || $fontVariant === 400) {
		$linkQuery = '';
	} elseif ($fontVariant === '400i') {
		$linkQuery = ':ital@1';
	} elseif (strpos($fontVariant, '00i') !== false) {
		$linkQuery = ':ital,wght@1,' . str_replace('00i', '00', $fontVariant);
	} else {
		$linkQuery = ":wght@$fontVariant";
	}

	$link = $isEmptyFamily ? '' : 'https://fonts.googleapis.com/css2?family=' . str_replace(' ', '+', $fontFamily) . $linkQuery . '&display=swap';

	return [
		'googleFontLink' => (!$isUploadFont || $isEmptyFamily) ? '' : "@import url($link);",
		'styles' => preg_replace('/\s+/', ' ', trim("
			$selector { $styles }
			$tabBreakpoint {
				$selector { " . self::isValidCSS('font-size', self::checkUnit($tabletFontSize)) . " }
			}
			$mobileBreakpoint {
				$selector { " . self::isValidCSS('font-size', self::checkUnit($mobileFontSize)) . " }
			}
		"))
	];
}
```

And use in a style tag in `php`.
```php
<?php
extract( $attributes );

ob_start(); ?>
<style>
	<?php
		echo GetCSS::getTypoCSS( '', $typography )['googleFontLink'];
		echo GetCSS::getTypoCSS( "selector", $typography )['styles'];
	?>
</style>
<?php return ob_get_clean();
```

<br />

## Options
### Props
Set this options as props of `<Typography />` component that used in `Settings.js`.

<br />

### className

Use it to set any `className`.

- Type: `String`
- Required: No

<br />

### label

Use a custom label for background component

- Type: `String`
- Required: No

<br />

### value

The current value of the background.

- Type: `Object`
- Required: Yes

<br />

### onChange

A function that receives the new value. The value will be an object.

- Type: `function`
- Required: Yes

<br />

### defaults

Use defaults value to give option for reset the value.

- Type: `Object`
- Required: No

<br />

### isFamily

If don't want to use font family, set it to `false`.

**Note**: if set `false`, also use in `getTypoCSS` function like `getTypoCSS(selector, typography, false)?.styles`.

- Type: `Boolean`
- Required: No