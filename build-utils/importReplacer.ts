import { AliasReplacerArguments } from 'tsc-alias';

export default function exampleReplacer({
  orig,
  file,
  config
}: AliasReplacerArguments): string {
  console.log(`${orig} => ${file}`);

  if (orig.startsWith('moonlands/dist')) return `${orig}.js`
  return orig;
}