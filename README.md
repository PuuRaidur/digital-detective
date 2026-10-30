# Digital Detective

Digital Detective is a OSINT CLI tool that gathers publicly available information by IP address; username; or a full name.

Read about [Policy](./POLICY.md) and [Contributing](./CONTRIBUTING.md)

## Features

- gather someone's address and phone number based on their name
- gather IP-related data such as ISP and geolocation
- check whether an username exists on specific social media platforms
- writing results to a file
- colored output for better visualization
- parallel fetching for better performance

## Prerequisites

- Node.js 24 or newer
- npm 12
- API keys for the used APIs

## Setup

1. Install the dependencies
```bash
git clone https://gitea.kood.tech/georgkaasik/digital-detective.git
cd digital-detective
npm install
```

2. Add your [IP2Location](https://www.ip2location.io/) and [Apify](https://apify.com)'s `one-api/skip-trace` Actor API keys into `.env` file at project root:
```bash
IP2LOCATION_API_KEY="your-api-key"
APIFY_API_KEY="your-api-key"
```

## Usage

```bash
node data_digger.js [OPTION] <input>
```
**Options:**
```bash
-h; --help - Show help info
-n; --name - Perform full name search
-ip; --ip-address - Perform IP address search
-un; --username - Perform username search
```
**Examples:**
```bash
node data_digger.js -n "Full Name"
node data_digger.js -ip 8.8.8.8
node data_digger.js -un "@username"
```