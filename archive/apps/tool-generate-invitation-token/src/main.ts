import fs from 'fs/promises';
import { parse as parsePath } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Participant, PrivateKey, createToken } from './tokens';
import { Command, Option } from 'commander';
import { stringify } from 'csv-stringify';

const program = new Command().name('invite-token');

const create = program
  .command('create')
  .description('Create an invitation token')
  .requiredOption(
    '--key-path',
    'Path to RSA private key (PEM) file',
    process.env['INVITATION_PRIVATE_KEY'],
  )
  .option('--key-id', 'Key identifier as a hint for verification')
  .addOption(
    new Option('--group', 'Cohort that the invitation is for')
      .default('GLW')
      .choices(['GLW', 'UKWM']),
  )
  .action(async function (options) {
    const token = createToken(
      { id: uuidv4(), cohort: 'GLW' },
      await getPrivateKey(options),
    );

    console.log(token);
  });

create
  .command('batch')
  .description('Creates a batch of invitation tokens')
  .requiredOption(
    '--key-path',
    'Path to RSA private key (PEM) file',
    process.env['INVITATION_PRIVATE_KEY'],
  )
  .requiredOption(
    '--output-path',
    'Path to write output file',
    process.env['INVITATION_OUTPUT_FILE'],
  )
  .option('--key-id', 'Key identifier as a hint for verification')
  .addOption(
    new Option('--group', 'Cohort that the invitation is for')
      .default('GLW')
      .choices(['GLW', 'UKWM']),
  )
  .requiredOption('--size', 'Number of tokens to generate', '100')
  .action(async function (options) {
    const key = await getPrivateKey(options);
    const records: Array<{ participantId: string; token: string }> = [];
    for (let i = 0; i < parseInt(options.size); i++) {
      const participant: Participant = { id: uuidv4(), cohort: options.cohort };
      records.push({
        participantId: participant.id,
        token: createToken(participant, key),
      });
    }
    stringify(records, { header: true }, async function (err, output) {
      if (err !== undefined) {
        console.error('Error generating CSV', err);
        return;
      }

      console.log(`Writing file ${options.outputPath}...`);
      await fs.writeFile(options.outputPath, output);
      console.log('Done');
    });
  });

program.parse();

async function getPrivateKey(options: {
  keyPath: string;
  keyId?: string;
}): Promise<PrivateKey> {
  return {
    id:
      options.keyId !== undefined
        ? options.keyId
        : parsePath(options.keyPath).name,
    content: await fs.readFile(options.keyPath),
  };
}
