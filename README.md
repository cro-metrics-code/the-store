# The Store

This is a demo e-commerce site built for various internal testing purposes at Cro Metrics. Even in "production" it runs in Stripe's "Test Mode" which allows you to successfully checkout using [Stripe's test cards](https://docs.stripe.com/testing#use-test-cards).

To checkout using the default test card, use the following details:

- Card Number: `4242 4242 4242 4242`
- Expiration Date: `Any future date`
- CVC: `Any 3 digits`

> [!IMPORTANT]
> The easiest way to deploy this project is on Vercel, however, Vercel **does not** allow deployments on their free "Hobby Tier" plan within an org.
>
> The main repo exists outside of Cro Metrics's org, but within the "cro-metrics-code" GitHub user (which is owned by Cro Metrics). That means you need to use the `cro-metrics-code` GitHub account to commit to the repo.
>
> However, managing two different GitHub accounts locally is a hassle, so the best solution is to **log into GitHub as `cro-metrics-code` and add yourself as a collaborator on the repo.**

## Branch Use

This branch is used for INSERT_USE_CASE_HERE

## Using the Project

> [!IMPORTANT] > **DO NOT** add any platform snippets to the `main` branch. See the [Branching Strategy](#branching-strategy) section for more information on how to add platform snippets.

## Branching Strategy

### Feature Changes

Feature changes should be done in a new branch create from `main` and merged into `main` via a pull request. Feature changes **should not** include any platform snippets.

### Working with Platform Snippets

If you want to add a platform snippet for a PoC or testing purposes:

1. Create a new branch from the `main` branch
2. Add whatever platform snippets you want to test.
3. Update the [Branch Use](#branch-use) section with the new branch's use case and any instructions that may be helpful for future ENG who may need to work with the branch.
4. Commit your changes and publish your branch to GitHub which will trigger a Vercel deployment and a preview URL which you can use for your snippet testing/PoC.

## Project setup

<details open>
<summary>Prerequisites</summary>

- Node.js v20+
  - It _should_ v22, but it has only been tested on v20.
- pnpm

  - The easiest way to install pnpm is via Node.js Corepack. From the root of the project run:

    ```shell
    corepack enable
    corepack install
    ```

  - Alternatively, follow [the instructions](https://pnpm.io/installation) for your operating system.

### Add Environment Variables

Copy `.env.example` into a new `.env` file. Add the missing ENV variable values from the "The Store (Demo Dev Playground)" item in 1Password.

</details>

<details open>
<summary>Local Dev</summary>

After following the above steps, run `pnpm install` to install the required dependencies, run `pnpm dev` to start the development server on your machine, and open your browser to [localhost:3000](http://localhost:3000)

</details>

## Stripe

<details>
<summary>Stripe Info</summary>

Stripe is used to manage the products displayed on the site. You should only need access to Stripe to add/remove/update products. If, for any reason, you need Stripe access, ask for an invite to our Stripe org.

Stripe works in two different modes:

1. **Test Mode**
2. **Production Mode**.

> [!CAUTION]
> Only use the Test Mode to ensure Stripe will never charge real money.

![Stripe Test Mode](/images/stripe-test-mode.png)

For more detailed info on Test Mode, please refer to the [Stripe documentation](https://docs.stripe.com/testing).

</details>

<details>
<summary>Add products</summary>

Stripe provides all the product data (names, prices, descriptions, categories, URL slugs, product variants, etc.).

To add a product:

1. Log into Stripe
2. Ensure the "**Test Mode**" toggle in the header is enabled
3. Select "**Product catalog**" from the left sidebar (or [click here to be taken to the Test Mode Product Catalog](https://dashboard.stripe.com/test/products))
4. Click on "**Create product**"
5. Add a name, description, and upload a product image
6. Click the "**More options v**" CTA (found between the "Tax" and "Pricing" sections) to expand the collapsed "**More options**" section
7. Find the "**Metadata**" section within the opened "**More options**" section
   1. Add the key, `slug`, with a value you want to use as the product's URL pathname, e.g., `my-awesome-product`
   2. Add any additional optional metadata fields (see the [Metadata](#metadata) section below)
8. Add a price (only _One-off_ payments are supported)
9. Click the "**Add product**" CTA

</details>

<details>
<a name="metadata"></a>
<summary>Product Metadata</summary>

Product metadata is used to provide more context information about the products. You can specify the following metadata fields:

| Key        | Required | Valid Values                                          | Description                                                    |
| :--------- | :------: | :---------------------------------------------------- | :------------------------------------------------------------- |
| `slug`     | **Yes**  | Any `string`[^1]                                      | Used for URLs pathnames; must be unique (except for variants). |
| `category` |    No    | `apparel` \ or `accessories`                          | Used for grouping products.                                    |
| `order`    |    No    | Any `number`                                          | Used for sorting products; lower numbers are displayed first.  |
| `variant`  |    No    | Any `string` containing valid URL pathname characters | Variant slug. Read below for details.                          |

[^1]: May only contain the following valid URL path characters: `a-z A-Z 0-9 . - _ ~ ! $ & ' ( ) * + , ; = : @`

</details>

<details>
<summary>Configuring Product Variants</summary>

To create a product with variants, you must add multiple products to Stripe with the same `slug` metadata field. The `variant` metadata field to distinguish between different variants of the same product. For example, if you have a T-shirt in multiple sizes, you can create three products with the `slug` of `t-shirt` and `variant` values of `small`, `medium`, and `large`.

Variants are displayed on the product page. Variants can have different prices, descriptions, and images. It's important to note that the `category` should be the same for all variants of the same product for the best browsing experience.

</details>

## Deployment

<details>
<summary>Vercel</summary>

### Vercel

<!-- markdownlint-disable no-bare-urls -->

This project is currently deployed on Vercel. Log into Vercel using "**Continue with GitHub**" and using the **GitHub (code@crometrics.com)** GitHub login from 1Password.

</details>

<details>
<summary>Docker?</summary>

### Docker?

If we were to ever want to move this away from Vercel and self-host via Docker, this is what we would need to do:

1. Remove `ENABLE_EXPERIMENTAL_COREPACK=1` in the `.env`
2. Add `DOCKER=1` in the `.env`
3. Execute `pnpm run docker:build`.
4. After that, you can start the container with `pnpm run docker:run`.

</details>

## Notes

- React Server Components allow only certain data types to be passed from the server to the client, but data from the Stripe SDK often contains class instances.
  - To get around this issue, `structuredClone` is used to eliminate the class instances from the data so plain objects can be passed from the server to the client.
