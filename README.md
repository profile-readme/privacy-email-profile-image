# privacy-email-profile-image

An email address badge for your GitHub profile README that shows your address as an
image instead of text, and lets you swap to a fresh address the moment the old one
starts attracting spam.

<p align="center">
  <img src="https://readmes.pages.dev/email/caption-email/ears" alt="Demo: an email address badge with fox ears, drawn as an image">
</p>
<p align="center">
  <img src="https://readmes.pages.dev/email/card/caption-contact" alt="Demo: the same badge in card style with a Contact caption">
</p>

The addresses in the demo above are made up. Reload the page and look closely: the
letters sit at slightly different heights each time, because the badge is drawn fresh
on every request.

Keywords: email badge, GitHub profile README, hide email from scrapers, email as image,
anti-spam, disposable email, temporary email, email alias, privacy, contact badge,
SVG badge, Cloudflare Pages Functions, serverless, swap email address, spam protection.

## Why show an email as an image

Putting a plain email address in a public README is an open invitation. Crawlers read
GitHub constantly, and an address written as text gets copied into spam lists within
days. The usual workarounds are awkward. Writing "name at example dot com" annoys the
people you actually want to hear from, and it barely slows down a modern scraper.

This badge takes a different approach. The address is drawn into a small bitmap on the
server and placed inside an SVG as pixels. The SVG source contains no address text at
all, so tools that search page source for things shaped like an email find nothing.
People still read the address at a glance and can type it into their mail client.

An image is not a vault. Optical character recognition can read pixels, and a person
can always copy an address by hand. So the badge is built around a second idea that
matters more than the first.

## Swap as it leaks

Instead of trying to keep one address secret forever, you keep a list of addresses.
These are typically disposable or alias addresses from a forwarding service, though
any address works. The badge shows one of them. When that address starts receiving
spam, you open a secret link, and the badge moves to the next address in your list.
You then retire or delete the leaked alias in your mail service.

Every profile, website and document that embeds the badge updates automatically,
because they all point at the same image URL. There is nothing to edit in your README
and nothing to commit. Old copies of the address that spammers collected stop working
as soon as you turn off that alias.

This turns address leaks from a permanent problem into a routine chore that takes a few
seconds.

## Quick start with the demo

You can see the badge in your own README right away by pasting this line:

```markdown
![Email address](https://readmes.pages.dev/email/caption-email)
```

The demo only ever shows made-up addresses, so it is useful for trying styles and not
for real contact details. To show your own addresses, deploy your own copy. The section
"Set up your own" below walks through it, and it takes about ten minutes on a free
Cloudflare account.

There is also a URL builder with a live preview at
[readmes.pages.dev/email/help](https://readmes.pages.dev/email/help).

## Options

Options are path segments written after `/email/`, in any order. A trailing `.svg` is
allowed and case does not matter. If you mistype an option, the badge turns into a small
pink notice naming the position of the unknown option, so typos are easy to spot.

### Style

| Option | Effect |
|---|---|
| `pill` | Rounded pill (default) |
| `card` | Card, with the caption on its own line above the address |
| `plain` | No background, just the icon and the address |
| `caption-email`, `caption-contact`, `caption-mail-me` | Caption reading "Email", "Contact" or "Mail me" |
| `noicon` | Hide the envelope icon |
| `ears` | Small fox ears on top of the badge |

### Size and color

| Option | Effect |
|---|---|
| `size-N` | Font size in pixels, from 10 to 40 (default 16) |
| `border-N` | Border width in pixels, from 0 to 8 (default 0) |
| `accent-RRGGBB` | Color of the icon, caption and border as hex without `#` |
| `auto` | Follow the viewer's light or dark preference (default) |
| `light`, `dark` | Force a theme |
| `transparent` | No background when there is no caption or border |

### Scraper resistance

| Option | Effect |
|---|---|
| `jitter-N` | Random per-letter offset from 0 to 3 (default 1) |
| `noise-N` | Faint random specks from 0 to 3 (default 1) |

Jitter and noise change on every request. At the default levels they are hard to notice
by eye, but they mean no two copies of the image are identical, which defeats simple
image matching and makes automated reading a little less reliable. Higher levels look
more hand-drawn. Level 0 turns each effect off if you prefer a perfectly clean look.

The text color always follows the theme. In auto mode the address is dark on light
backgrounds and light on dark ones, matching GitHub's own theme for each viewer.

## How swapping works

Each deployment has a list of addresses and a secret swap token, both stored as
encrypted Cloudflare secrets. A tiny key-value store remembers which address is
currently live, and nothing else.

Opening `/email/swap/<token>` moves to the next address in the list, wrapping back to the
first after the last. Opening `/email/swap/<token>/<n>` jumps straight to address number
n, counting from 1. Opening `/email/status/<token>` tells you which address is live
without changing anything.

The responses are short plain-text messages such as "ok, showing address 3 of 12". They
include a partly masked version of the address, like `m****-l******-q***@protonmail.com`,
so you can confirm the switch without the full address appearing in your browser
history.

A wrong token gets exactly the same "404 Not Found" as any page that does not exist.
Nobody can tell from the outside whether a deployment has swapping enabled. Tokens
shorter than 32 characters are refused outright, and token checks take the same time
whether a guess is close or not.

The badge itself is sent with caching turned off, so GitHub's image proxy asks for a
fresh copy each time a profile is viewed. After a swap, the new address shows up
everywhere within about a minute.

## Set up your own

You need a free Cloudflare account, Node.js 20 or newer, and `make`. There is no
`npm install`, because the project has no dependencies. Wrangler, Cloudflare's command
line tool, runs through `npx` the first time you use it.

### 1. Create your copy

Click "Use this template" on GitHub, then "Create a new repository". A private
repository works fine. Clone it to your computer.

Edit `site.config.json` and put your own name and repository link in it. These appear in
the page footer of the help page and in the badge's copyright comment.

### 2. Create the Pages project and the state store

```sh
npx wrangler pages project create my-badges --production-branch production
npx wrangler kv namespace create email-state
```

The second command prints an id. Copy `wrangler.toml.example` to `wrangler.toml` and fill
in your project name and that id. The real `wrangler.toml` is listed in `.gitignore`, so
it stays on your computer.

### 3. Store your addresses

Put your addresses in a text file, one per line, outside the repository. Then store them
as an encrypted secret:

```sh
npx wrangler pages secret put EMAILS --project-name my-badges < ~/private/emails.txt
```

Commas, semicolons and spaces also work as separators. Duplicates are dropped, and
anything that does not look like a valid address is ignored. The status page tells you
how many entries were skipped.

### 4. Create a swap token

Generate a long random token and store it as a secret too:

```sh
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
npx wrangler pages secret put EMAIL_SWAP_TOKEN --project-name my-badges
```

Keep the token somewhere safe, such as your password manager. Anyone who has it can
change which address your badge shows, although they cannot see the full address list.

### 5. Deploy and embed

```sh
make test
make deploy PROJECT=my-badges
```

Your badge now lives at `https://my-badges.pages.dev/email`. Add it to your profile
README with generic alt text, and never with the address itself:

```markdown
![Email address](https://my-badges.pages.dev/email/caption-email)
```

Open `https://my-badges.pages.dev/email/status/<token>` once to confirm that everything
is connected.

### Local preview

Copy `.dev.vars.example` to `.dev.vars`, adjust it, and run `make dev`. The file is git
ignored. Use made-up addresses there if you can, so real ones never sit in a project
folder.

## Managing the address list

### How many addresses fit

Cloudflare limits each environment variable or secret to 5 KiB. A typical alias such as
`maple-lantern-q7x2@protonmail.com` takes around 30 to 35 bytes including the line
break, so one variable holds roughly 150 to 170 addresses. Long custom domains reduce
that number.

If you need more, add `EMAILS_2`, `EMAILS_3` and so on up to `EMAILS_9`. They are read
in order and joined into one list, which allows well over a thousand addresses. Most
people will never need more than a handful.

### Choosing addresses

Alias and forwarding services are the natural fit. Many mail providers and privacy tools
can create a new forwarding address in one click, and deleting it later cuts off spam
completely without touching your real inbox. Any normal address works too, if you would
rather rotate between mailboxes you own.

Addresses may use letters, digits, dots, hyphens, underscores and plus signs before the
`@`. Rare characters outside that set cannot be drawn, so entries containing them are
skipped and counted on the status page.

### Changing the list while live

You can replace the `EMAILS` secret at any time; redeploy afterwards so the new value is
picked up. The live position is remembered as a number. If you shorten the list, the
number wraps around safely. If you reorder the list, check the status page and use
`/email/swap/<token>/<n>` to pick the address you want.

A good routine is to keep a few unused aliases at the end of the list. When one leaks,
swap, retire the old alias, and add a fresh one to the end when convenient.

## Keeping the token safe

The swap link is a normal web address with the token inside it, which is convenient but
has a few side effects worth knowing.

Chat apps and some email clients fetch links automatically to show a preview. If you
paste your swap link into a chat, the preview fetch itself will swap the address. Keep
the link out of messaging apps, or use the status link when you only want to look.

Browsers remember visited addresses. If you share a computer, use a private window or
call the link from a terminal instead:

```sh
curl https://my-badges.pages.dev/email/swap/<token>
```

Cloudflare may keep request logs for your account that include the path. That is your own
account, but it is one more place the token appears. If you think the token has been seen
by someone else, generate a new one and store it exactly as in step 4 of the setup. The
old token stops working immediately.

## What it protects against

The badge is designed to defeat cheap, large-scale address harvesting. Crawlers that read
page source, follow `mailto:` links, or run text patterns over HTML will find nothing,
because there is no text to find. Every response is pixel-different, so simple image
fingerprinting does not help either.

It is not designed to stop a person who wants your address, or a scraper that runs OCR on
every image it sees. No image can do that, since anything humans can read, a machine can
read too. Swapping is the real defense: a leaked address costs you a few seconds rather
than years of spam.

Do not use this badge for anything that must stay confidential. Treat every address you
put in the list as one that may eventually become public.

## Accessibility

Screen readers announce the badge as "Email address, shown as an image" and cannot read
the address itself, because exposing it to assistive technology would also expose it to
scrapers. If accessibility matters for your audience, add another way to reach you next
to the badge, such as a contact form or a profile on a platform with private messages.

The text color follows the viewer's light or dark preference. Contrast meets WCAG AA in
both themes at the default size, and the help pages support keyboard navigation and
reduced motion.

## Web pages

Besides the badge, each deployment serves two small pages.

| Path | What it is |
|---|---|
| `/email/help` | Every option plus a URL builder with live preview |
| `/email/agents` | Markdown guide for AI agents and tools |

They include Open Graph tags and schema.org JSON-LD, and preview deployments are
automatically marked noindex. Scripts are allowed by hash only, through a strict Content
Security Policy.

### Project layout

```
functions/email/           Pages Functions: badge, swap, status, help, agents
src/email/                 option parsing, rasterizer, PNG encoder, SVG, pages
src/email/font.generated.js  glyph bitmaps (DejaVu Sans Mono Bold)
scripts/build.mjs          site.config.json -> src/email/site.generated.js
scripts/build-font.mjs     rebuild the glyph table (ImageMagick)
test/                      node:test unit tests
wrangler.toml.example      template for your KV binding (copy to wrangler.toml)
.dev.vars.example          template for local secrets (copy to .dev.vars)
```

Everything lives under an `email` path, so this project can share one Pages project with
other badge apps without any file names colliding.

## FAQ

### Can I make the badge a clickable mailto link?

You can wrap it in a link, but a `mailto:` link puts the address back into your README as
text, which undoes the point. Most people copy the address by reading it.

### Why not just use a contact form?

Forms are great and work well alongside this badge. Some people simply prefer email, and
a visible address is still the most universal way to be reached.

### Does it work outside GitHub?

Yes. Anywhere that can show an image URL can show the badge, including personal sites,
other code hosts and forum signatures.

### How fast does a swap show up?

Usually within a minute. The state store updates within about sixty seconds worldwide,
and the badge itself is never cached.

### Do I need the key-value store?

Only for swapping by link. Without it, you can set an `EMAIL_INDEX` variable (counting
from 1) to choose the address and change it by redeploying. That works, but the link is
much faster when an address leaks.

### Can the demo show my address?

No. The demo shows made-up addresses only and accepts no input. Your real addresses
belong in a deployment that you control.

## Troubleshooting

### The badge says "no address configured"

The deployment cannot see any valid address. Check that the secret is named exactly
`EMAILS` and that it belongs to the same Pages project you deployed to. Secrets only
reach new deployments, so deploy once more after storing or changing them. If the list
is there but every entry is skipped, look for unusual characters around the `@` sign.

### The swap link returns 404

A 404 means the token did not match, was missing, or is shorter than 32 characters.
Copy the token again from your password manager, watching for a stray space at either
end. Remember that the secret must be named `EMAIL_SWAP_TOKEN`, and that like any
secret it only takes effect after a fresh deployment.

### The swap link returns 503

The token is correct, but the deployment has no state store. Make sure your
`wrangler.toml` contains the `EMAIL_STATE` binding with the id of your key-value
namespace, then deploy again from the folder that holds that file.

### My profile still shows the old address

Give it a minute first, since the state store takes up to about sixty seconds to reach
every location. If it is still old after that, your browser may be holding on to its own
copy; a hard refresh usually fixes it. GitHub's image proxy normally respects the
no-cache headers the badge sends, but it can occasionally lag for a little longer.

### The address looks blurry or too small

Use a larger `size-N` value rather than scaling the image with HTML width attributes.
The bitmap is drawn at high resolution, so sizes up to 40 stay sharp on most screens.
If the letters look uneven, lower the jitter level or turn it off with `jitter-0`.

## Privacy

The service stores one number: the position of the live address in your list. Your
address list and token live in encrypted Cloudflare secrets and never appear in the
repository. The badge reads no cookies and accepts no uploads. It sets no tracking of any
kind and does not log visitors.

On GitHub, images are fetched through GitHub's proxy, so the badge normally never sees
the IP addresses of people viewing your profile. As with any website, Cloudflare may keep
standard request logs under its own [privacy policy](https://www.cloudflare.com/privacypolicy/).

## Disclaimer

The hosted demo at `readmes.pages.dev` is provided "as is" and free of charge, without
warranty of any kind, express or implied. That includes warranties of merchantability,
fitness for a particular purpose, availability and non-infringement. It may be
rate-limited, changed or taken offline at any time without notice. The authors are not
liable for any damages arising from its use, including spam, lost messages or exposure of
any address you choose to publish.

This project reduces automated harvesting of email addresses. It does not guarantee that
an address shown in the badge stays private, and it is not a security product.

This project is not affiliated with, endorsed by or sponsored by GitHub, Cloudflare or
Proton. Example addresses in this document and in the demo are invented for illustration.
They are not known to belong to anyone, so please do not write to them.

If you deploy your own copy, you alone are responsible for the addresses you publish and
for keeping your swap token safe. You are also responsible for following the terms of the
services you use and the law where you live.

Nothing in this repository is legal advice. The license texts are the authoritative terms.

## License

The code is licensed under the [GNU AGPL-3.0](LICENSE). If you run a modified version as
a public service, you must offer its source to its users; keeping your template copy public
on GitHub satisfies this.

The glyph bitmaps in `src/email/font.generated.js` are rasterized from DejaVu Sans Mono
Bold and remain under the Bitstream Vera license in [LICENSE-FONT](LICENSE-FONT). The
[NOTICE](NOTICE) file summarizes which license applies where.

---

<p align="center"><sub>© 2026 Aesthetic Vulpes (<a href="https://github.com/didvc">github.com/didvc</a>) · <a href="https://readmes.pages.dev/">readmes.pages.dev</a></sub></p>
