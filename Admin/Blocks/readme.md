### AJAX handler for enabling/disabling blocks

add_action('wp_ajax_bPlBlocksDisabled',[$this,'bPlBlocksDisabled']);

public function bPlBlocksDisabled(){
$nonce = sanitize_text_field( wp_unslash( $\_POST['_wpnonce'] ) ) ?? null;

    if( !wp_verify_nonce( $nonce, 'wp_ajax' )){
        wp_send_json_error( 'Invalid Request' );
    }

    $data = json_decode( stripslashes( $_POST['data'] ), true );
    $db_data = get_option( 'bPlBlocksDisabled', [] );

    if( !isset( $data ) && $db_data ){
        wp_send_json_success( $db_data );
    }

    update_option( 'bPlBlocksDisabled', $data );
    wp_send_json_success( $data );

}

### Data Configuration

```js
export const blocksInfo = {
title:'All Blocks',
action:'bPlBlocksDisabled',
blocks:[
{
name: `${pluginSlug}/container`,
title: 'Container',
icon: '',
demo: ``,
docs: ``,
},
{
name: `${pluginSlug}/row`,
title: 'Row',
icon: '',
demo: `${demoLink}/row/`,
docs: `${docsURL}/row-block/`,
},
{
name: `${pluginSlug}/td-viewer`,
title: '3D Viewer',
icon: '',
demo: `${demoLink}/3d-viewer/`,
docs: `${docsURL}/3d-viewer-block/`,
},
{
name: `${pluginSlug}/advanced-image`,
title: 'Advanced Image',
icon: '',
demo: ``,
docs: ``,
},
{
name: `${pluginSlug}/alert`,
title: 'Alert',
icon: '',
demo: `${demoLink}/alert/`,
docs: `${docsURL}/alert-block/`,
},
{
name: `${pluginSlug}/animated-text`,
title: 'Animated Text',
icon: '',
demo: `${demoLink}/animated-text/`,
docs: `${docsURL}/animated-text-block/`,
},
]
}

<Route path='blocks' element={<Blocks nonce={nonce} info={blocksInfo} />} />

```
