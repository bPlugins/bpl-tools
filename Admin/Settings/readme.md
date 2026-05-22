# Settings

Uninstall-data management page. Provides a toggle to enable or disable permanent data deletion when the plugin is uninstalled. Requires a PHP AJAX handler to persist the setting.

## Import

```js
// Named export from the Admin index
import { Settings } from 'bpl-tools/Admin';
// or
import Settings from 'bpl-tools/Admin/Settings';
```

## Usage

```js
import { Settings } from '../../../../bpl-tools/Admin';
import { settingsInfo } from '../utils/data';

<Route path='settings' element={<Settings {...props} {...settingsInfo} />} />
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin name — shown in danger zone description text |
| `version` | string | — | Plugin version shown in the status strip |
| `deleteDataOnUninstall` | boolean | yes | Current value — from PHP option, passed through `dashboardInfo` |
| `uninstallNonce` | string | yes | WP nonce for the AJAX call — pass `uninstallNonce` from PHP |
| `ajaxAction` | string | yes | WP Ajax action name (e.g. `'apbSaveUninstallOption'`) |
| `cleanupItems` | string[] | — | Overrides the default list of items that will be deleted on uninstall |

## `settingsInfo` in `data.js`

```js
export const settingsInfo = {
    ajaxAction:   'myPluginSaveUninstallOption',
    cleanupItems: [
        __('All shortcode posts (myplugin post type)', 'my-plugin'),
        __('Plugin settings and options',              'my-plugin'),
    ]
}
```

## PHP Requirements

### 1. Pass the initial state from PHP

```php
'deleteDataOnUninstall' => (bool) get_option( 'my_plugin_delete_data_on_uninstall', false ),
'uninstallNonce'        => wp_create_nonce( 'bPlLicenseActivation' ),
```

### 2. Register the AJAX handler

The action name must match `settingsInfo.ajaxAction`.

```php
add_action( 'wp_ajax_myPluginSaveUninstallOption', [ $this, 'saveUninstallOption' ] );

public function saveUninstallOption() {
    $nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
    if ( ! wp_verify_nonce( $nonce, 'bPlLicenseActivation' ) ) {
        wp_send_json_error( 'Invalid nonce' );
    }

    $enabled = isset( $_POST['enabled'] ) && 'true' === sanitize_text_field( wp_unslash( $_POST['enabled'] ) );
    update_option( 'my_plugin_delete_data_on_uninstall', $enabled );

    wp_send_json_success( [
        'enabled' => $enabled,
        'message' => $enabled
            ? 'Data deletion enabled.'
            : 'Data will be preserved on uninstall.'
    ] );
}
```

## Default `cleanupItems`

When `cleanupItems` is not provided:

- All plugin posts and custom post types
- Plugin settings and options
- Layout configuration and meta data
- Taxonomy terms and associations
- All tracking and analytics data
