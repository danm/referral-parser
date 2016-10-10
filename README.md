----------
Referral Parser
=======
---------

Parse a referral url into useful information

```js
const Referral = require('referral-parser');
let refObj = new Referral('http://www.google.co.uk/?q=bbc+news');
```

```json
{
  type: 'search',
  name: 'Google',
  search: 'bbc news',
  host: 'www.google.co.uk' 
}
```

## Installation

```bash
$ npm install referral-parser
```

## Features

 - Fast
 - Extensible

## Philosophy

Two of the biggest analytics companies have their own open source data sets of referring websites. Overtime these have become quite separated and no longer aligned meaning you choose one or the other. Referral Parser is combines these two libraries, filters then and makes them available as a single list.  

We can then use this dataset, feed in our referral string and get some useful information back.

## License

  [MIT](LICENSE)

