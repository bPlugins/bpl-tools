# Onboarding

Full-screen guided setup wizard shown once after plugin activation. Walks a new user through a short sequence of steps, saving real settings as they go, and ends on a "create your first thing" call to action.

Config-driven — the component owns layout, navigation, progress, and persistence. Your plugin supplies the step definitions and a PHP AJAX handler.

> First consumer: HTML5 Video Player.

## Import

```js
// Named export from the Admin index
import { Onboarding } from 'bpl-tools/Admin';
// or
import Onboarding from 'bpl-tools/Admin/Onboarding';
```

## Usage

The wizard renders on its own hidden admin page, not inside the dashboard `Layout` — it needs the full viewport and has no nav.

```js
import Onboarding from '../../../../bpl-tools/Admin/Onboarding';
import { onboardingInfo } from '../utils/data';

<Onboarding
    {...props}
    steps={onboardingInfo({ hasElementor })}
    values={props.values}
    ajaxAction='myplugin_save_onboarding'
    nonce={props.nonce}
    exitUrl={`${adminUrl}edit.php?post_type=myplugin&page=myplugin-dashboard`}
    finishButton={{ label: 'Create Your First Item', url: `${adminUrl}post-new.php?post_type=myplugin` }}
/>
```

`ajaxAction` + `nonce` is the whole transport contract. A plain `add_action( 'wp_ajax_myplugin_save_onboarding', … )` handler is all you need — see [PHP Requirements](#php-requirements).

**If your plugin routes AJAX through a dispatcher** (one action, with `model` / `method` in the payload), add whichever keys it expects and they're posted alongside the values:

```js
    ajaxAction='myplugin_ajax_handler'
    ajaxModel='Onboarding'      // posted as `model`
    ajaxMethod='save'           // posted as `method`
```

Both are omitted by default, so nothing extra is sent unless you ask for it.

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin name shown beside the logo in the top bar |
| `media` | object | yes | `{logo, thumbnail?, video?, isYoutube?}` — `video`/`thumbnail` act as the step-video fallback |
| `steps` | object[] | yes | Step definitions — see below |
| `values` | object | yes | Current option values keyed by field `id`. Seeds the fields so a re-run shows real state |
| `ajaxAction` | string | yes | WP Ajax action name (e.g. `'h5vp_ajax_handler'`) |
| `ajaxModel` | string | — | Model name when your handler routes by model (e.g. `'Onboarding'`). Omit for a flat handler |
| `ajaxMethod` | string | — | Method name when your handler routes by method. Defaults to `'save'`; pass `''` to omit |
| `nonce` | string | yes | Nonce matching whatever your handler verifies. **Must pair with `ajaxAction`** — see Gotchas |
| `exitUrl` | string | yes | Where "Exit Guided Setup" and "Go to Dashboard" navigate |
| `finishButton` | object | yes | `{label, url}` — the primary CTA on the final step |
| `onComplete` | function | — | Called after the final save resolves, before navigation |

## Step definitions

`steps` is an ordered array. The progress rail is generated from its length, so 3 steps or 6 steps both work.

```js
{
    key:      'welcome',        // unique; used as the React key and in save payloads
    title:    'Welcome to My Plugin',
    subtitle: 'The professional widget for WordPress.',
    video:    { … },            // optional — see Video below
    bullets:  [                 // optional — checkmark list
        'Embed YouTube, Vimeo, and self-hosted video',
        'Customize controls, branding, and chapters'
    ],
    features: [ … ],            // optional — feature tour rows, see below
    fields:   [ … ],            // optional — omit for an informational step
    tips:     [ … ],            // optional — final-step tip list
    nextLabel: "Let's Get Started",  // optional; defaults to "Continue"
    skipLabel: 'Skip',          // optional — see "Skip" below
    secondaryAction: {          // optional — external link in the footer
        label: 'Upgrade to Pro',
        url:   'https://example.com/pricing/'
    }
}
```

### Feature tour (`features`)

A "here's what you get" screen. Rows marked `locked` get a padlock instead of a tick and a filled badge, which pairs naturally with `secondaryAction` as the upgrade route.

```js
features: [
    { title: 'YouTube & Vimeo', badge: 'Included', description: 'Embed from any major source.' },
    { title: 'Video Chapters',  badge: 'Pro', locked: true, description: 'Clickable timestamp markers.' }
]
```

`title` and `description` are rendered as HTML.

A step with no `fields` is informational: **Next** advances immediately with no AJAX round-trip.

### Copy that reacts to an earlier answer

`steps` is built once, at mount, before the user has answered anything. To make a later step reflect an earlier choice, declare `title`, `subtitle`, `bullets`, `tips`, or `tipsLabel` as a **function of the live values**:

```js
{
    key: 'done',
    title: "You're All Set!",
    tipsLabel: ({ editor }) => `Adding a video with ${editor}:`,
    tips: ({ editor }) => GUIDES[editor] || GUIDES.default
}
```

This is what makes a "how do you work?" step worth asking: the final screen shows only the instructions that match the answer, instead of every workflow at once. Without it the question is stored and never used.

### Field types

Each entry in `fields` maps one control to one option key. The `id` is what your PHP handler receives and what `values` is read from.

```js
// choice — card selector, one of N
{ type: 'choice', id: 'editor', label: 'How will you add videos?', options: [
    { value: 'gutenberg', label: 'Gutenberg', icon: <svg…/>, description: 'Use the block editor' },
    { value: 'elementor', label: 'Elementor', icon: <svg…/>, description: 'Drag the widget in' },
    { value: 'shortcode', label: 'Shortcode', icon: <svg…/>, description: 'Paste anywhere' }
]}

// color
{ type: 'color', id: 'primary_color', label: 'Brand color', default: '#00b2ff',
  description: 'Accent color for the player interface' }

// toggle
{ type: 'toggle', id: 'pause_others', label: 'Play one at a time', default: false,
  description: 'Starting one player pauses any other on the page' }
```

Conditionally hide a field or a whole choice option with `condition: (values) => boolean`. Use this rather than filtering the array yourself, so the wizard can keep the value if the condition flips back.

### Explaining a setting (`help`)

`description` is a one-liner and should stay one. When a setting genuinely needs a paragraph — what it does, when to turn it on, what it looks like — add `help` and it becomes an ⓘ next to the label that opens a modal:

```js
{
    type: 'toggle',
    id: 'gutenberg_enable',
    label: 'Enable Gutenberg shortcode generator',
    description: 'Adds a shortcode builder to the block editor',
    help: {
        title: 'Gutenberg shortcode generator',
        body: [ 'First paragraph…', 'Second paragraph…' ],   // string or array; HTML allowed
        example: '[html5_video id="12"]'                      // optional monospace block
    }
}
```

This keeps the step scannable — a user who already knows what the toggle does never has to read past the label.

## Video

The welcome step takes **its own `video` property**. When absent, the component falls back to `media.video` / `media.isYoutube`, which most plugins already define in `dashboardInfo`.

```js
video: {
    url:       'https://youtu.be/rOVr8TX5C70',
    isYoutube: true,
    poster:    '',   // optional — falls back to media.thumbnail, then YouTube hqdefault
    title:     ''    // optional — iframe title, for accessibility
}
```

Resolution order:

```js
const video = step.video
    ?? ( media?.video
            ? { url: media.video, isYoutube: media.isYoutube, poster: media.thumbnail }
            : null );
```

**Why a separate property:** onboarding usually wants a short "here's how it works" clip, which is a different asset from the marketing video on the Welcome page. Keeping them separate lets each be chosen on its own merits — and the fallback means a plugin with only one video needs no extra config to adopt the wizard.

Rendering — the step shows a **poster thumbnail**, and the clip plays in a **modal**:

| Resolved value | Thumbnail | Modal player |
|---|---|---|
| `isYoutube: true` | `poster`, else `media.thumbnail`, else YouTube `hqdefault` | Autoplaying `<iframe>` embed |
| `isYoutube: false` | `poster` if set, else a neutral gradient | `<video autoPlay controls playsInline>` |
| `null` | No media block. The step lays out cleanly without it | — |

The thumbnail is a facade: nothing is embedded, and YouTube is never contacted, until the user actually asks to watch. Closing the modal unmounts the player, which is what stops playback.

The modal closes on the **X**, on a **backdrop click**, and on **Escape**. It locks body scroll while open and returns focus to the thumbnail on close. Markup follows the `bPlVideoModal` / `bPlVideoModalContent` / `bPlVideoModalOverlay` convention already used by `Welcome/Overview`.

## Behaviour

- **Saves on Next**, not on Finish. A user who bails at step 3 keeps steps 2 and 3.
- **Skip** (`skipLabel`) advances without saving **and rolls that step's fields back** to the values they were seeded with. Because the final save posts the whole value set, leaving edits in state would persist exactly what Skip implies it won't. On a field-less step it is simply a quieter Next.
- **Exit Guided Setup** marks the wizard seen and navigates to `exitUrl`. Already-saved values are kept.
- **Back** does not re-save; it only moves the pointer.
- The progress rail is clickable for completed steps, inert for steps ahead of the current one.
- The wizard is never modal-locked. Exit is available on every step.

## PHP Requirements

### 1. Register a hidden full-screen page

```php
add_submenu_page( 'edit.php?post_type=myplugin', __( 'Setup', 'my-plugin' ), '', 'manage_options', 'myplugin-setup', [ $this, 'setupPage' ] );
remove_submenu_page( 'edit.php?post_type=myplugin', 'myplugin-setup' ); // URL-reachable, hidden from nav
```

Use `remove_submenu_page()` — the `add_submenu_page( null, … )` trick is deprecated as of PHP 8.1.

Hide the admin chrome with a body class on that screen only:

```css
body.myplugin-fullscreen #adminmenumain,
body.myplugin-fullscreen #wpadminbar,
body.myplugin-fullscreen #wpfooter { display: none; }
body.myplugin-fullscreen #wpcontent { margin-left: 0; padding-left: 0; }
```

### 2. Pass initial state to the mount point

```php
public function setupPage() { ?>
    <div id='mypluginOnboarding' data-info="<?php echo esc_attr( wp_json_encode( [
        'version'  => MYPLUGIN_VER,
        'adminUrl' => admin_url(),
        'nonce'    => wp_create_nonce( 'myplugin_ajax_handler' ),
        'values'   => [
            'editor'        => Settings::get( 'myplugin_onboarding_editor', '' ),
            'primary_color' => Settings::get( 'myplugin_primary_color', '#00b2ff' ),
            'pause_others'  => (bool) Settings::get( 'myplugin_pause_others', false ),
        ],
        'hasElementor' => class_exists( '\Elementor\Plugin' ),
    ] ) ); ?>"></div>
<?php }
```

### 3. Redirect once on activation

```php
register_activation_hook( __FILE__, function () {
    add_option( 'myplugin_onboarding_redirect', 1 );
} );

add_action( 'admin_init', function () {
    if ( ! get_option( 'myplugin_onboarding_redirect' ) ) {
        return;
    }
    delete_option( 'myplugin_onboarding_redirect' );

    // Never hijack a bulk activation — WP.org guideline.
    if ( isset( $_GET['activate-multi'] ) ) {
        return;
    }
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    wp_safe_redirect( admin_url( 'edit.php?post_type=myplugin&page=myplugin-setup' ) );
    exit;
} );
```

If the plugin uses Freemius, point its `first-path` at the same URL and keep the above as the fallback for when the opt-in screen is skipped.

### 4. Handle the save

Every forward move posts the **full accumulated value set**, not just the current step's fields, plus:

| Key | Value |
|---|---|
| `step` | `key` of the step being left — branch on it if you want, ignore it otherwise |
| `completed` | `true`, sent only on Finish and on Exit |

Sending everything each time makes saves idempotent and last-write-wins, so a double-clicked **Next** can't corrupt state. Booleans arrive as the strings `"true"` / `"false"` — use `rest_sanitize_boolean()`.

A plain `wp_ajax_` handler is the whole integration — no dispatcher, no conventions:

```php
add_action( 'wp_ajax_myplugin_save_onboarding', [ $this, 'handle' ] );

public function handle() {
    check_ajax_referer( 'myplugin_save_onboarding', 'nonce' );

    if ( ! current_user_can( 'manage_options' ) ) {
        wp_send_json_error( '403 Forbidden', 403 );
    }

    // Allow-list: anything not named here is ignored, so the wizard can never
    // write an arbitrary option key.
    $fields = [
        'editor'        => 'sanitize_key',
        'primary_color' => 'sanitize_hex_color',
        'pause_others'  => 'rest_sanitize_boolean',
    ];

    foreach ( $fields as $key => $sanitize ) {
        if ( ! isset( $_POST[ $key ] ) ) {
            continue;
        }
        update_option( "myplugin_{$key}", call_user_func( $sanitize, wp_unslash( $_POST[ $key ] ) ) );
    }

    if ( ! empty( $_POST['completed'] ) && rest_sanitize_boolean( $_POST['completed'] ) ) {
        update_option( 'myplugin_onboarding_completed', MYPLUGIN_VER );
    }

    wp_send_json_success( [ 'saved' => true ] );
}
```

The action name here, the `ajaxAction` prop, and the string passed to `wp_create_nonce()` must all be the same — that trio is the single most common setup mistake.

If instead you route through a dispatcher, keep verification wherever that dispatcher already does it and have it forward to a method like the above.

### 5. Mark completion

The final step posts `{ completed: true }`. Persist it — this is what suppresses re-entry and what a "re-run setup" link clears.

```php
update_option( 'myplugin_onboarding_completed', MYPLUGIN_VER );
```

## Reaching existing users

Activation redirects only help new installs. For users who already have the plugin, add a one-time dismissible notice when `myplugin_onboarding_completed` is absent, linking to the setup page. `Base/AdminNotice.php` in HTML5 Video Player is a working template — per-user meta dismissal, nonce-checked AJAX, inline dismiss script.

## Gotchas

- **Nonce and action must pair.** The most common failure is localizing a nonce created for one action while the handler verifies another — every save returns 403 with no visible error. Create the nonce with the same string the handler checks. Passing the action name from PHP alongside the nonce keeps the two from drifting apart.
- **`ajaxModel` / `ajaxMethod` are opt-in.** They exist only for plugins whose AJAX layer dispatches on those keys. Omit them for a plain handler; supplying only one of a pair your dispatcher requires means every save is rejected.
- **Capability level.** These are site-wide settings. Handlers that check `edit_posts` (common for content AJAX) are too permissive here; use `manage_options`.
- **Enqueue guard.** Plugins commonly gate `admin_enqueue_scripts` on `strpos( $hook, 'plugin-slug' )`. A setup page with a different slug will load with no JS. Extend the guard.
- **Fresh activation only.** Gate the redirect on an option set in `register_activation_hook`, not on the absence of settings — otherwise it fires again after every update.
- **`values` must be seeded.** Without it, a re-run shows defaults and a user who only changes one field silently resets the others on the next save.
