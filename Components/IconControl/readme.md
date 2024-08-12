### style.php
In order to use icon object in `php`. You have to create a function like `getIconCSS`.

```php
function getIconCSS( $icon, $isSize = true, $isColor = true ) {
	extract( $icon );
	$fontSize = $fontSize ?? 16;
	$colorType = $colorType ?? 'solid';
	$color = $color ?? 'inherit';
	$gradient = $gradient ?? 'linear-gradient(135deg, #4527a4, #8344c5)';

	$colorCSS = 'gradient' === $colorType ?
		"color: transparent; background-image: $gradient; -webkit-background-clip: text; background-clip: text;" :
		"color: $color;";

	$styles = '';
	$styles .= !$fontSize || !$isSize ? '' : "font-size: $fontSize" . "px;";
	$styles .= $isColor ? $colorCSS : '';

	return $styles;
}
```