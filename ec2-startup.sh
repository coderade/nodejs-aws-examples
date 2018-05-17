#!/bin/bash
curl --silent --location https://rpm.nodesource.com/setup_10.x | sudo bash -
sudo yum install -y nodejs
sudo yum install -y git
git clone https://github.com/coderade/aws-ec2-examples
cd hbfl
npm i
npm run start

# The above commands base64 encoded for entering into UserData [https://www.base64encode.org/]
# IyEvYmluL2Jhc2gNCmN1cmwgLS1zaWxlbnQgLS1sb2NhdGlvbiBodHRwczovL3JwbS5ub2Rlc291cmNlLmNvbS9zZXR1cF8xMC54IHwgc3VkbyBiYXNoIC0NCnN1ZG8geXVtIGluc3RhbGwgLXkgbm9kZWpzDQpzdWRvIHl1bSBpbnN0YWxsIC15IGdpdA0KZ2l0IGNsb25lIGh0dHBzOi8vZ2l0aHViLmNvbS9jb2RlcmFkZS9hd3MtZWMyLWV4YW1wbGVzDQpjZCBoYmZsDQpucG0gaQ0KbnBtIHJ1biBzdGFydA==
