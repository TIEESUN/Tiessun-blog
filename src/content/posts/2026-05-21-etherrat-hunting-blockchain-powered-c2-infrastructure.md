---
template: blog-post
title: "EtherRAT: Hunting Blockchain-Powered C2 Infrastructure"
slug: etherrat-hunting-blockchain-powered-c2-infrastructure
date: 2026-05-22 00:34
description: Malware, blockchain, etherrat, cybersecurity, phishing, threat, APT
featuredImage: /assets/etherrat.png
---
<!--StartFragment-->

Blockchain technology was built for trustless, decentralized finance. Threat actors found another use for it. EtherRAT is a JavaScript-based remote access trojan that stores its command and control address directly inside an Ethereum smart contract. When the malware needs to phone home, it doesn't reach out to a hardcoded domain that defenders can block. It queries the blockchain, which is publicly accessible, permanently available, and impossible to take down. The operator updates the C2 URL by sending a cheap transaction to the contract. The malware reads it back using a silent, read-only call that leaves no trace on-chain and looks like normal Web3 traffic on the wire. No domain to seize. No server to take offline. No DNS to sinkhole. For $1.37 per update, the operator rotates infrastructure faster than defenders can respond. We went hunting.

## The Smart Contract

Everything started at:

<!-- notionvc: 5395cd21-f8f4-468e-8428-a687c6481d15 -->

<!--EndFragment-->

```
0xe26c57b7fa8de030238b0a71b3d063397ac127d3
```

![](/assets/cnp_22052026_003938.png)

<!--StartFragment-->

The contract is unverified on Etherscan. No source code published, no transparency, just raw bytecode. That alone is a red flag for any contract receiving repeated zero-value transactions. What made it more interesting was a note from Etherscan: 23 other contracts share identical bytecode. The same C2 template deployed across multiple campaigns, each serving a separate operator.

<!-- notionvc: 715ad327-0db7-4132-973a-2c74039de699 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004008.png)

<!--StartFragment-->

The mechanism is simple and effective. Two functions drive the entire operation:

| Function             | Method ID    | Purpose                         |
| -------------------- | ------------ | ------------------------------- |
| `setString(string)`  | `0x7fcaf666` | Operator writes the live C2 URL |
| `getString(address)` | `0x7d434425` | Malware reads it back silently  |

The contract uses a `mapping(address => string)` structure, meaning each operator wallet gets its own isolated storage slot. The malware calls `getString(operatorAddress)` and gets back exactly one URL: the active C2. The read happens via `eth_call`, a read-only query that generates no transaction, no gas cost, no on-chain record. From a network monitoring perspective it is indistinguishable from a legitimate DeFi application querying a public RPC endpoint.

We can see the operator actively rotating C2 domains through the decoded transaction logs:

<!-- notionvc: f183b747-3e88-4b22-b832-f7ccbf7f01ed -->

<!--EndFragment-->

![](/assets/cnp_22052026_004030.png)

<!--StartFragment-->

## The Operator Wallet

Every smart contract has a creator. We traced the contract back to its deployer:

<!-- notionvc: 680943ef-6347-4279-9021-bd20708b8229 -->

<!--EndFragment-->

```
0x8D7e3Cc5342439fF28C589a902B685EA4d398C12
```

![](/assets/cnp_22052026_004102.png)

<!--StartFragment-->

The wallet tells a clean story. 22 transactions total, first activity 111 days ago, still active 9 days before this report. The ETH balance sits at just enough to cover gas — this is a purpose-built operator wallet, not a financial one.

What caught our attention immediately was the funding source. The wallet was seeded by **ChangeNOW16**, a hot wallet belonging to ChangeNOW, a no-KYC instant cryptocurrency exchange requiring zero identity verification. A deliberate choice for someone who doesn't want to be found.

<!-- notionvc: 952fa088-cf91-4795-bd9c-22849482be5b -->

<!--EndFragment-->

![](/assets/cnp_22052026_004122.png)

<!--StartFragment-->

The sequence is exact. ChangeNOW funds the wallet. Minutes later the operator deploys the contract. From that point on, every outbound transaction is a

setString()

call rotating the active C2 domain.

<!-- notionvc: f37e7352-502b-42df-8c75-09e057b88f07 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004144.png)

<!--StartFragment-->

The wallet has no other activity. No token transfers, no DeFi interactions, no cross-chain activity on BSC or Polygon. It exists for one purpose only: maintaining the C2 contract.

## C2 Domains

Decoding every `setString()` call from the operator wallet gave us the full C2 rotation history. Eight domains were previously known from industry reporting. We found four that had never been published anywhere.

| Domain                                        | Status           |
| --------------------------------------------- | ---------------- |
| [hayesmed.com](http://hayesmed.com)           | Previously known |
| [regancontrols.com](http://regancontrols.com) | Previously known |
| [salinasrent.com](http://salinasrent.com)     | Previously known |
| [mebeliotmasiv.com](http://mebeliotmasiv.com) | Previously known |
| [euclidrent.com](http://euclidrent.com)       | Previously known |
| [o-parana.com](http://o-parana.com)           | Previously known |
| [palshona.com](http://palshona.com)           | Previously known |
| [aurineuroth.com](http://aurineuroth.com)     | Previously known |
| **[aabstone.com](http://aabstone.com)**       | 🆕 This report   |
| **[twicegrand.com](http://twicegrand.com)**   | 🆕 This report   |
| **[ager-stp.org](http://ager-stp.org)**       | 🆕 This report   |
| **[jariosos.com](http://jariosos.com)**       | 🆕 This report   |

We pivoted on each new domain.

### [aabstone.com](http://aabstone.com)

Registered March 16, 2026. The VT community flagged it with 14/91 detections, Kill Chain C&C tagged, with Generic Trojan and Adware family labels.

<!-- notionvc: 5754c7fd-caa7-482d-8698-19fadb83077d -->

<!--EndFragment-->

![](/assets/cnp_22052026_004212.png)

![](/assets/cnp_22052026_004227.png)

<!--StartFragment-->

Once the Lazarus Group attribution was established through the identified domain, we turned to the Threat Actor Encyclopedia in the Hokage Intel CTI platform to deepen our understanding of the adversary. The encyclopedia provided a comprehensive profile of the group — covering their known malware families, historically attributed IOCs, exploited vulnerabilities, and documented TTPs. Cross-referencing our findings against this intelligence confirmed strong alignment with Lazarus Group's established patterns of operation, further solidifying the attribution.

<!-- notionvc: ac17650d-44db-4c98-a7d6-4fea1005bc62 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004250.png)

<!--StartFragment-->

Now back to the domain:

<!-- notionvc: 354f37b4-b96a-4abd-972f-027af9225a71 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004309.png)

![](/assets/cnp_22052026_004320.png)

![](/assets/cnp_22052026_004334.png)

<!--StartFragment-->

The communicating files section is where it gets interesting. A JavaScript file named EtherRAT_Deobfuscated.js was scanned on May 2, 2026, just days before this report, with 23/61 detections. A live EtherRAT sample actively communicating with a domain we found independently.

<!-- notionvc: 29391393-a67a-4db1-8837-753f360cf552 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004406.png)

<!--StartFragment-->

The MD5 hash of the deobfuscated payload was submitted to the IOC enrichment section, where it returned multiple intelligence hits — directly tying the file to EtherRAT's core functionality, including its Ethereum-based C2 mechanism (EtherHiding), target selection routines, and CDN-like beaconing behavior.

<!-- notionvc: 80e57cac-da10-4d59-ac50-fbc8f5159f70 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004425.png)

![](/assets/cnp_22052026_004441.png)

![](/assets/cnp_22052026_004455.png)

![](/assets/cnp_22052026_004508.png)

<!--StartFragment-->

The domain resolved to multiple IPs, with 46.38.156.25 in Finland standing out with a flagged detection.

<!-- notionvc: 7f7dffcc-9c3f-4b3d-a4b1-0414ee5f793e -->

<!--EndFragment-->

![](/assets/cnp_22052026_004533.png)

![](/assets/cnp_22052026_004547.png)

<!--StartFragment-->

The JARM fingerprint across aabstone.com came back as:

<!-- notionvc: fedae837-58f0-468f-9075-0086f17bfbd8 -->

<!--EndFragment-->

```
27d40d40d00040d00042d43d000000d2e61cae37a985f75ecafb81b33ca523
```

<!--StartFragment-->

We kept that fingerprint in mind.

### [twicegrand.com](http://twicegrand.com)

<!-- notionvc: 0051176b-37d1-4974-903a-84b9d6c511ee -->

<!--EndFragment-->

![](/assets/cnp_22052026_004629.png)

<!--StartFragment-->

Searching [twicegrand.com](http://twicegrand.com/) on the platform returned a matching intelligence profile, corroborating the earlier findings with consistent Lazarus Group attribution and overlapping C2 indicators.

<!-- notionvc: 20e9c966-86c5-4428-9498-34d8734b3c66 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004647.png)

<!--StartFragment-->

Registered March 23, 2026, one week after aabstone.com. 7/91 detections on VT.

<!-- notionvc: 1dff026b-14d8-4d4f-8ce3-ea68b1a0e61e -->

<!--EndFragment-->

![](/assets/cnp_22052026_004712.png)

![](/assets/cnp_22052026_004724.png)

<!--StartFragment-->

The passive DNS history showed the domain resolving to **185.227.144.114**, ASN 50053 Anton Levin. The same ASN as [aabstone.com](http://aabstone.com). That is not a coincidence.

The communicating files on [twicegrand\[.]com](http://twicegrand.com) were two:

<!-- notionvc: 664b8d04-97c5-46ba-a1da-98ade6771b1e -->

<!--EndFragment-->

![](/assets/cnp_22052026_004757.png)

<!--StartFragment-->

v114l.exe was labelled as Trojan.EtherRat

<!-- notionvc: 8fb8852b-0fbb-4f8b-af49-79755a42fa4a -->

<!--EndFragment-->

![](/assets/cnp_22052026_004815.png)

![](/assets/cnp_22052026_004830.png)

<!--StartFragment-->

ce_v1.ps1 was detected by Google and Ikarus as Trojan-Downloader.PS.EtherRat, explicitly naming the malware family and confirming our attribution directly from the domain.

<!-- notionvc: 3cf9f80f-9bcf-431d-9a55-2e8af93daf68 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004848.png)

<!--StartFragment-->

The dropped files from ce_v1.ps1 painted a clear picture of the lure being used. Node.js package manager files, install_tools.bat, bca516, and persistence components. A victim is told to set up a development environment for a coding test. They run the installer. The infection begins.

<!-- notionvc: 9c445c48-6133-467e-84b4-e953148c6c85 -->

<!--EndFragment-->

![](/assets/cnp_22052026_004922.png)

![](/assets/cnp_22052026_004935.png)

<!--StartFragment-->

The JARM fingerprint on [twicegrand.com](http://twicegrand.com/):

<!-- notionvc: 280ca9ad-0a61-4efe-a2fe-6a3af1d71beb -->

<!--EndFragment-->

![](/assets/cnp_22052026_004954.png)

```
27d40d40d00040d00042d43d000000d2e61cae37a985f75ecafb81b33ca523
```

<!--StartFragment-->

Identical to [aabstone.com](http://aabstone.com/).

### [ager-stp.org](http://ager-stp.org)

<!-- notionvc: badef702-a2b6-4367-bf70-318c481fdb13 -->

<!--EndFragment-->

![](/assets/cnp_22052026_005029.png)

<!--StartFragment-->

Registered April 23, 2026. The most recently registered of our new domains, still being stood up weeks before this report. 1/91 detections on VT, SOCRadar flagging it as malicious, Kill Chain C&C tagged as Generic Trojan.

<!-- notionvc: 9d888b44-1fde-4630-b17f-89996d75976e -->

<!--EndFragment-->

![](/assets/cnp_22052026_005049.png)

![](/assets/cnp_22052026_005103.png)

<!--StartFragment-->

The domain resolved to 2.27.120.79, ASN 206134 Nekobyte Infoma. A reverse DNS lookup on that IP returned ager-stp.org as the sole domain, tagged malicious with Kill Chain C&C and Generic Trojan labels confirming it as a dedicated C2 host with no legitimate use.

<!-- notionvc: bd20ea77-6da2-4e69-9320-ef72d1d8c4a1 -->

<!--EndFragment-->

![](/assets/cnp_22052026_005127.png)

<!--StartFragment-->

The JARM fingerprint:

<!-- notionvc: 2ead8086-cf6e-4edd-b866-a33df841132f -->

<!--EndFragment-->

```
27d40d40d00040d00042d43d000000d2e61cae37a985f75ecafb81b33ca523
```

<!--StartFragment-->

Three domains. Three different IPs. Three different ASNs. One identical JARM fingerprint across all of them.

## Registration Fingerprint

Three different domains. Three different IPs. Three different ASNs. But when we pulled WHOIS on all three, the registrant data was byte-for-byte identical.

<!-- notionvc: d2495066-b12b-4001-bf4c-c1d252d430be -->

<!--EndFragment--><!--StartFragment-->

| Property    | [aabstone.com](http://aabstone.com) | [twicegrand.com](http://twicegrand.com) | [ager-stp.org](http://ager-stp.org) |
| ----------- | ----------------------------------- | --------------------------------------- | ----------------------------------- |
| Registered  | Mar 16 2026                         | Mar 23 2026                             | Apr 23 2026                         |
| Registrar   | Tucows (ID:69)                      | Tucows (ID:69)                          | Tucows (ID:69)                      |
| Nameservers | Njalla                              | Njalla                                  | Njalla                              |
| Country     | Saint Kitts and Nevis               | Saint Kitts and Nevis                   | Saint Kitts and Nevis               |
| City hash   | 1f8f4166599d23ee                    | 1f8f4166599d23ee                        | 1f8f4166599d23ee                    |
| State hash  | 5c1896d54f3bb30d                    | 5c1896d54f3bb30d                        | 5c1896d54f3bb30d                    |

<!-- notionvc: 2722a025-8b03-4cd4-b272-b91075993ce9 -->

<!--EndFragment-->

![](/assets/cnp_22052026_005225.png)

![](/assets/cnp_22052026_005238.png)

![](/assets/cnp_22052026_005256.png)

![](/assets/cnp_22052026_005331.png)

![](/assets/cnp_22052026_005344.png)

<!--StartFragment-->

The registrant fields are fully redacted across all three domains. The operator used Njalla as the DNS provider, an anonymity-focused service that shields the true registrant identity, combined with an offshore registration country in Saint Kitts and Nevis. What gives them away is not the content of those fields but the pattern across them. Same registrar, same nameservers, same country, registered within weeks of each other. Same operator, same tooling, same campaign. This is the campaign fingerprint. Any domain sharing this exact combination of Tucows ID:69, Njalla nameservers and Saint Kitts registration belongs to this operator.

## Infection Chain

Pivoting from [twicegrand.com](http://twicegrand.com)'s passive DNS record led us to **185.227.144.114**, ASN 50053 Anton Levin, the same ASN as [aabstone.com](http://aabstone.com).

<!-- notionvc: 082272ff-62ab-4d24-97db-800261d2a6e4 -->

<!--EndFragment-->

![](/assets/cnp_22052026_005409.png)

<!--StartFragment-->

Two files were communicating with this IP. ce_v1.ps1, which we already confirmed as Trojan-Downloader.PS.EtherRat, and v114l.exe with 23/55 detections.

<!-- notionvc: 43233dbb-d1b6-4c74-bd3b-0930fc0d8246 -->

<!--EndFragment-->

![](/assets/cnp_22052026_005436.png)

![](/assets/cnp_22052026_005448.png)

<!--StartFragment-->

ce_v1.ps1 dropped multiple files on victim machines, among which notable ones are:

<!-- notionvc: a2d5bdc4-917f-464e-b8bd-1c4fd4fa38bb -->

<!--EndFragment-->

![](/assets/cnp_22052026_005514.png)

<!--StartFragment-->

[25a144ce9881ebdd.old](https://www.virustotal.com/gui/file/7bcdd37c17c255fb9ed9c07ad370a439c68fc4e06ee3e71cf8a0e097149823c9) carried the threat label trojan.etherrat. VT's AI analysis left no ambiguity:

> "A sophisticated Remote Access Trojan and Downloader. It uses heavy obfuscation and techniques such as querying the Ethereum blockchain Dead Drop Resolver to find its C2 server. It logs activities to a local file, exfiltrates system identifiers, and implements a persistent loop to fetch and execute arbitrary remote payloads using child_process and dynamic function constructors."

<!-- notionvc: 05ff185a-b056-4e01-b9ea-2a68ba5d6fa3 -->

<!--EndFragment-->

![](/assets/cnp_22052026_005537.png)

<!--StartFragment-->

9881ebdd.bin detected as HEUR:Trojan.Script.Generic by Kaspersky.

<!-- notionvc: 73e98388-6035-4547-9ca4-ff556e30d3ab -->

<!--EndFragment-->

![](/assets/cnp_22052026_005558.png)

<!--StartFragment-->

node_etw_provider.man had three execution parents that revealed the rest of the chain:

<!-- notionvc: f5fa5f84-805f-4966-97b3-fa12255f3a8a -->

<!--EndFragment-->

![](/assets/cnp_22052026_005621.png)

<!--StartFragment-->

build_dARaMELazoQA_8a0f4801-3008-47e4-82f4-546e5e3ea4ee.ps1 — labeled trojan.powershell. Contacted

https://nodejs.org/dist/v18.17.0/node-v18.17.0-win-x64.zip

. A legitimate Node.js download used as cover while malicious components execute alongside it.

<!-- notionvc: a0d9bc27-033d-48ab-af1b-0ec96007683a -->

<!--EndFragment-->

![](/assets/cnp_22052026_005642.png)

![](/assets/cnp_22052026_005654.png)

![](/assets/cnp_22052026_005706.png)

<!--StartFragment-->

ssd(2).ps1 — also labeled trojan.powershell, also pulling the same Node.js zip from nodejs.org.

<!-- notionvc: 93f19e3c-ca71-4fad-930a-1f53d1365938 -->

<!--EndFragment-->

![](/assets/cnp_22052026_005914.png)