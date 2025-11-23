# Step by Step Guid to make a Dashboard

> [!WARNING]
>
> Do not use this [data] and prefix! replace with your plugins data.

## Admin Menu & Admin Enqueue scripts

- Create a admin Menu
- Within Menu callback return/add a dom with unique id

```php
<div
	id='apbDashboard'
	data-info='<?php echo esc_attr( wp_json_encode( [
		'version' => APB_VERSION,
		'isPremium' => apbIsPremium(),
		'hasPro' => APB_HAS_PRO
	] ) ); ?>'
></div>
```

- Only For that menu path enqueue your (admin | dashboard) script and css

## (admin | dashboard).js

```js
import { createRoot } from "react-dom/client";

import "./(admin | dashboard).scss";
import App from "./Components/App";
import { dashboardInfo } from "./utils/data";

document.addEventListener("DOMContentLoaded", () => {
  const dashboardEl = document.getElementById("apbDashboard");
  const info = JSON.parse(dashboardEl.dataset.info);

  createRoot(dashboardEl).render(<App {...dashboardInfo(info)} />);
});
```

## (admin | dashboard).scss

```scss
@import "../../../bpl-tools/Admin/Components/style.scss";
```

### utils/data.js

```js
const slug = "advanced-post-block";

export const dashboardInfo = (info) => {
  const { version, isPremium, hasPro } = info;

  const proSuffix = isPremium ? " Pro" : "";

  return {
    name: `Advanced Post Block${proSuffix}`,
    displayName: `Advanced Post Block${proSuffix} - Showcase Posts with Grid, List, Card Layouts and Filters`,
    description:
      "Advanced Post Block is a powerful and flexible block plugin that allows you to display posts, display blog posts, and embed custom posts in a fully customizable and responsive layout.",
    slug,
    logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
    banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
    // video: 'https://www.youtube.com/watch?v=milYZrqLJsE',
    // isYoutube: true,
    version,
    isPremium,
    hasPro,
    pages: {
      org: `https://wordpress.org/plugins/${slug}/`,
      landing: `https://bplugins.com/products/${slug}/`,
      docs: `https://bplugins.com/docs/${slug}/`,
      pricing: `https://bplugins.com/products/${slug}/#pricing`,
    },
    freemius: {
      product_id: 14262,
      plan_id: 23856,
      public_key: "pk_87f141adce326dfb96ba4e12d8a36",
    },
  };
};

export const changelogs = [
  {
    version: "2.0.0 - 13 Aug 2025",
    list: [
      "Fix Post Type Issues",
      "Update SDK",
      "Change UI",
      "Admin Dashboard",
    ],
  },
  {
    version: "1.16.1 - 3 Jul 2025",
    list: ["Fix Pagination issue"],
  },
  {
    version: "1.16.0 - 18 Jun 2025",
    list: [
      "Update Upgrade Page",
      "Fix other users premium unlock issue",
      "Update SDK",
    ],
  },
];

export const demoInfo = {
  title: "Live Overview",
  description: "Click on any section to view it live",
  layout: "list",
  allInOneLabel: "See All Demos",
  allInOneLink: "https://apb.bplugins.com/all-demos-in-one-place/",
  demos: [
    {
      icon: "",
      title: "Wide Img",
      description: "",
      category: "",
      type: "image",
      url: "https://placehold.co/2000x500/856BFE/FFFFFF/svg",
    },
    {
      icon: "",
      title: "Long Img",
      description: "",
      category: "",
      type: "image",
      url: "https://images.pexels.com/photos/32837692/pexels-photo-32837692.jpeg",
    },
    {
      icon: "",
      title: "small Img",
      description: "",
      category: "",
      type: "image",
      url: "https://placehold.co/200x300/856BFE/FFFFFF/svg",
    },
    {
      icon: "",
      title: "Grid- Default layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/grid-default-layout/",
    },
    {
      icon: "",
      title: "Grid- Title Meta layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/grid-title-meta-layout/",
    },
    {
      icon: "",
      title: "Grid- Side Image layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/grid-side-image-layout/",
    },
    {
      icon: "",
      title: "Grid- Overlay layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/grid-overlay-layout/",
    },
    {
      icon: "",
      title: "Masonry- Default layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/masonry-default-layout/",
    },
    {
      icon: "",
      title: "Masonry- Title Meta layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/masonry-title-meta-layout/",
    },
    {
      icon: "",
      title: "Masonry- Side Image layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/masonry-side-image-layout/",
    },
    {
      icon: "",
      title: "Masonry- Overlay layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/masonry-overlay-layout/",
    },
    {
      icon: "",
      title: "Slider- Side Image layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/slider-side-image-layout/",
    },
    {
      icon: "",
      title: "Slider- Overlay layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/slider-overlay-layout/",
    },
    {
      icon: "",
      title: "Ticker- Side Image layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/ticker-side-image-layout/",
    },
    {
      icon: "",
      title: "Ticker- Overlay layout",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/ticker-overlay-layout/",
    },
    {
      icon: "",
      title: "All Posts",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/all-posts/",
    },
    {
      icon: "",
      title: "Post Section (Design 1)",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/design-1/",
    },
    {
      icon: "",
      title: "Post Section (Design 2)",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/post-section-design-2/",
    },
    {
      icon: "",
      title: "Post Section (Design 3)",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/post-section-design-3/",
    },
    {
      icon: "",
      title: "Post Section (Design 4)",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/post-section-design-4/",
    },
    {
      icon: "",
      title: "Post Section (Design 5)",
      description: "",
      category: "",
      type: "iframe",
      url: "https://apb.bplugins.com/demo/post-section-design-5/",
    },
  ],
};

export const filterDemoInfo = {
  categories: [
    { label: "All", value: "all", col: 3, height: "300px" },
    { label: "Hero", value: "hero", col: 3 },
    { label: "Ticker", value: "ticker", col: 3 },
    { label: "FAQ", value: "faq", col: 1, height: "400px" },
    {
      label: "Call To Actions",
      value: "call-to-actions",
      col: 2,
      height: "350px",
    },
    { label: "Testimonial", value: "testimonial", col: 3 },
    { label: "Info List", value: "info-list", col: 2, height: "350px" },
    { label: "About", value: "about", col: 3, height: "300px" },
    { label: "Timeline", value: "timeline", col: 3 },
    { label: "Team", value: "team", col: 1 },
  ],
  demos: [
    {
      title: "Testimonial Hero",
      categories: ["hero", "testimonial"],
      url: "https://images.pexels.com/photos/32837692/pexels-photo-32837692.jpeg",
    },
    {
      title: "luxurious fanion furniture store website",
      categories: ["about", "faq"],
      url: "https://www.shutterstock.com/image-vector/luxuriou…tion-furniture-store-website-260nw-2558738679.jpg",
    },
    {
      title: "Home Page Hero",
      categories: ["ticker", "faq"],
      url: "https://www.shutterstock.com/image-vector/pet-adopt-website-homepage-hero-260nw-2572368469.jpg",
    },
    {
      title: "Pet healthcare grooming food shop",
      categories: ["ticker", "faq"],
      url: "https://www.shutterstock.com/image-vector/pet-healthcare-grooming-food-shop-260nw-2572367501.jpg",
    },
    {
      title: "Store",
      categories: ["timeline", "call-to-actions"],
      url: "https://www.shutterstock.com/image-vector/pet-healthcare-grooming-food-shop-260nw-2572367493.jpg",
    },
    {
      title: "Modern Furniture landing page design",
      categories: ["about", "faq"],
      url: "https://www.shutterstock.com/image-vector/modern-furniture-landing-page-design-260nw-2558737307.jpg",
    },
    {
      title: "Web Design Elements",
      categories: ["ticker"],
      url: "https://img.freepik.com/free-vector/web-design-elements-flat-style_23-2147542130.jpg",
    },
    {
      title: "Modern Original Style Search Banners",
      categories: ["ticker"],
      url: "https://img.freepik.com/premium-vector/set-modern-original-style-search-banners_105895-325.jpg",
    },
    {
      title: "Objects Collection",
      categories: ["ticker"],
      url: "https://img.freepik.com/free-vector/web-objects-collection_23-2147543149.jpg",
    },
    {
      title: "Web Ad",
      categories: ["ticker"],
      url: "https://img.freepik.com/free-vector/create-your-ad-web_23-2147510092.jpg",
    },
    {
      title: "Templates Applications",
      categories: ["ticker"],
      url: "https://img.freepik.com/premium-vector/set-navbar-templates-applications_1062041-141.jpg",
    },
    {
      title: "Design Elements Flat Style",
      categories: ["team", "testimonial"],
      url: "https://img.freepik.com/free-vector/web-design-elements-flat-style_23-2147542130.jpg",
    },
    {
      title: "Design Elements Flat Style",
      categories: ["team", "info-list"],
      url: "https://img.freepik.com/free-vector/web-design-elements-flat-style_23-2147542130.jpg",
    },
  ],
};

export const dynamicPricingInfo = {
  logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`, // Optional
  pluginId: 15342,
  planId: 25570,
  licenses: [1, 3, null],
  button: {
    label: "Buy Now ➜",
  },
  featured: {
    selected: 3, // choose from licenses item
    text: "Best Value",
  },
};

export const pricingInfo = {
  cycles: [
    {
      cycle: "monthly",
      label: "Monthly",
      isDefault: false,
    },
    {
      cycle: "annual",
      label: "Yearly",
      isDefault: true,
    },
    {
      cycle: "lifetime",
      label: "Lifetime",
      isDefault: false,
    },
  ],
  plans: [
    {
      name: "Single Site",
      quantity: 1,
      prices: {
        monthly: "4.99",
        annual: "47.88",
        lifetime: "149.99",
      },
      pricePrefix: "",
      priceSuffix: "",
      isFeatured: false,
      note: "",
    },
    {
      name: "3 Sites",
      quantity: 3,
      prices: {
        monthly: "8.99",
        annual: "83.88",
        lifetime: "259.99",
      },
      pricePrefix: "",
      priceSuffix: "",
      isFeatured: true,
      note: "",
    },
    {
      name: "Unlimited Sites",
      quantity: "null",
      prices: {
        monthly: "33.99",
        annual: "323.88",
        lifetime: "979.99",
      },
      pricePrefix: "",
      priceSuffix: "",
      isFeatured: false,
      note: "",
    },
  ],
  features: [
    "More layouts and sub-layouts",
    "Tag & Custom Taxonomy Filter",
    "Post Offset",
    "Include or Exclude Posts",
    "Pagination",
    "Sort the title and meta elements",
    "Custom icon for metadata",
    "Taxonomies in Meta",
    "Reading Time",
    "Excerpt from Content",
    "Feature Image Size",
    "ShortCode Powered",
    "Update Post Query",
  ],
  button: {
    label: "Buy Now ➜",
  },
  featured: {
    text: "Best Value",
  },
};

export const featureCompareInfo = {
  title: "Features",
  plans: [
    {
      id: "ztbk4ex2fyi",
      name: "Free Plan",
      color: "#485781",
    },
    {
      id: "lhmjqhkeyi",
      name: `<span style='color: #485781;'>Pro Start from </span><span style='font-size: 1.3em;'>47.88/y</span>`,
      color: "#146EF5",
    },
  ],
  features: [
    {
      label: "Multiple Layouts (Grid, Masonry, Ticker, and Slider)",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label: "Sub Layout (Left/Right Image, Overlay Box, Title Meta, and more)",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label:
        "Post Query (filter by post type, categories, author, post count, and order)",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label: "Show/Hide Post Elements",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label: "Feature Image Settings",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label: "Post Title Customization",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label: "Meta Info Customization",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label: "Custom Read More Button",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label: "Fully Responsiveness for mobile, tablet, and desktop",
      plans: ["ztbk4ex2fyi", "lhmjqhkeyi"],
    },
    {
      label: "Display Pages & Custom Post Types",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Advanced Filtering (filter by tag, taxonomy, author, and more)",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Post Offset (skip the first n posts)",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Include/Exclude Posts by IDs",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Exclude Current Post",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Customizable pagination",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Rearrange/Sort post title and metadata.",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Feature Image Custom Size",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Display Reading Time",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Excerpt from Main Content",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Custom Post Query Hook",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Post Ticker Customization",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Shortcode to display posts block anywhere",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Enable/Disable Meta Author Link",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Display categories, tags, and custom taxonomies",
      plans: ["lhmjqhkeyi"],
    },
    {
      label: "Custom Meta Icons",
      plans: ["lhmjqhkeyi"],
    },
  ],
};
```

### App.js

```js
import { HashRouter as Router, Route, Routes } from "react-router-dom";

import ListDemos from "../../../../bpl-tools/Admin/Components/Demos/ListDemos";
import FilterDemos from "../../../../bpl-tools/Admin/Components/Demos/FilterDemos";
import FSCheckoutForm from "../../../../bpl-tools/Admin/Components/FSCheckoutForm/FSCheckoutForm";
import Pricing from "../../../../bpl-tools/Admin/Components/Pricing/Pricing";
import FeatureCompare from "../../../../bpl-tools/Admin/Components/FeatureCompare/FeatureCompare";

import Layout from "./Layout";
import {
  demoInfo,
  featureCompareInfo,
  filterDemoInfo,
  pricingInfo,
} from "../utils/data";
import Welcome from "./Welcome";

const App = (props) => {
  const { isPremium } = props;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout {...props} />}>
          <Route index element={<Welcome {...props} />} />

          <Route path="welcome" element={<Welcome {...props} />} />

          <Route
            path="demos"
            element={
              <ListDemos demoInfo={demoInfo} {...props}>
                {!isPremium && <Button href="#pricing">Buy Now</Button>}
              </ListDemos>
            }
          />

          <Route
            path="filter-demos"
            element={
              <FilterDemos demoInfo={filterDemoInfo} {...props}>
                {!isPremium && <Button href="#pricing">Upgrade Now</Button>}
              </FilterDemos>
            }
          />

          {!isPremium && (
            <Route
              path="purchase"
              element={
                <FSCheckoutForm freemius={freemius} options={{ title: name }} />
              }
            />
          )}

          {!isPremium && (
            <Route
              path="pricing"
              element={
                <DynamicPricing pricingInfo={pricingInfo} options={{}} />
              }
            />
          )}
          {!isPremium && (
            <Route
              path="pricing"
              element={
                <DynamicPricing pricingInfo={dynamicPricingInfo} options={{}} />
              }
            />
          )}

          {!isPremium && (
            <Route
              path="feature-comparison"
              element={
                <FeatureCompare
                  featureCompareInfo={featureCompareInfo}
                  {...props}
                />
              }
            />
          )}

          <Route path="*" element={<Welcome {...props} />} />
        </Route>
      </Routes>
    </Router>
  );
};
export default App;
```

### Layout.js

```js
import { Outlet, Link, useLocation } from "react-router-dom";

import Header from "../../../../bpl-tools/Admin/Components/Header/Header";

const navigation = [
  { name: "Welcome", href: "/welcome" },
  { name: "Demos", href: "/demos" },
  { name: "Filter Demos", href: "/filter-demos" },
  { name: "Purchase", href: "/purchase" },
  { name: "Pricing", href: "/pricing" },
  { name: "Feature Comparison", href: "/feature-comparison" },
];

const Layout = (props) => {
  const { isPremium } = props;

  const location = useLocation();

  return (
    <div className="bPlDashboard">
      <Header {...props}>
        <nav className="bPlDashboardNav">
          {navigation
            ?.filter(
              (item) =>
                !isPremium ||
                !["/purchase", "/pricing", "/feature-comparison"].includes(
                  item.href
                )
            ) // Hide link for premium users
            ?.map((item, index) => (
              <Link
                key={index}
                to={item.href}
                className={`navLink ${
                  location.pathname === item.href ? "active" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
        </nav>
      </Header>

      <main className="bPlDashboardMain">
        <div className="bPlDashboardContainer">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
export default Layout;
```

### Welcome.js

```js
import Changelog from "../../../../bpl-tools/Admin/Components/Changelog/Changelog";
import Overview from "../../../../bpl-tools/Admin/Components/Overview/Overview";

import { changelogs } from "../utils/data";

const Welcome = (props) => {
  const { name, isPremium, freemius } = props;

  return (
    <>
      <Overview {...props}>
        {!isPremium && (
          <Button href="#pricing" variant="secondary">
            Buy Now
          </Button>
        )}
      </Overview>

      <Changelog changelogs={changelogs} {...props} />
    </>
  );
};
export default Welcome;
```
