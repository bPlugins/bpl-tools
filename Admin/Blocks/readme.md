### AJAX handler for enabling/disabling blocks

Add this to your plugin's main class to handle block status persistence.

```php
add_action('wp_ajax_bPlBlocksDisabled', [$this, 'bPlBlocksDisabled']);

public function bPlBlocksDisabled() {
    $nonce = sanitize_text_field( wp_unslash( $_POST['_wpnonce'] ) ) ?? null;

    if (!wp_verify_nonce($nonce, 'wp_ajax')) {
        wp_send_json_error('Invalid Request');
    }

    $data = json_decode(stripslashes($_POST['data']), true);
    $db_data = get_option('bPlBlocksDisabled', []);

    if (!isset($data) && $db_data) {
        wp_send_json_success($db_data);
    }

    update_option('bPlBlocksDisabled', $data);
    wp_send_json_success($data);
}
```

### Data Configuration (`blocks.js`)

Define your blocks in an array. You can group them by including a `children` property.

```js
import { containerIcon, rowIcon, teamMembersIcon, tDViewerIcon, ... } from './blocksIcon';

const pluginSlug = 'b-blocks';
const siteURL = 'https://bblockswp.com';
const demoLink = `${siteURL}/demo`;
const docsURL = `${siteURL}/docs`;

export default [
    {
        title: 'Grid',
        children: [
            {
                name: `${pluginSlug}/container`,
                title: 'Container',
                icon: containerIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                required: true
            },
            {
                name: `${pluginSlug}/row`,
                title: 'Row',
                icon: rowIcon,
                demo: `${demoLink}/row/`,
                docs: `${docsURL}/row-block/`,
                status: 'published',
                required: true
            }
        ]
    },
    {
        name: `${pluginSlug}/td-viewer`,
        title: '3D Viewer',
        icon: tDViewerIcon,
        demo: `${demoLink}/3d-viewer/`,
        docs: `${docsURL}/3d-viewer-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/content-ticker`,
        title: 'Content Ticker',
        status: 'published',
        isPremium: true
    }
];
```

### Component Usage

```js
import Blocks from 'bpl-tools/Admin/Blocks';
import blocks from './utils/blocks';

<Route 
    path='blocks' 
    element={
        <Blocks 
            {...props} 
            allBlocks={blocks} 
            disabledBlocks={disabledBlocks}
            onChange={handleBlocksChange}
            status={savingStatus}
        />
    } 
/>
```
