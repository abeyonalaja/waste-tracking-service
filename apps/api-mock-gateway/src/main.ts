import { db } from './db';
import * as jsonServer from 'json-server';
import { AddressPlugin } from './modules/address';
import { FeedbackPlugin } from './modules/feedback';
import { ReferenceDataPlugin } from './modules/reference-data';
import { SubmissionPlugin } from './modules/submission';
import { TemplatePlugin } from './modules/template';
import { BulkSubmissionPlugin } from './modules/bulk-submission';
import { getWellKnownParams, userFilter, validateToken } from './auth';
import jwksRsa from 'jwks-rsa';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Algorithm } from 'jsonwebtoken';
import PrivateBetaPlugin, {
  PrivateBetaMock,
} from './modules/private-beta/private-beta.plugin';

const server = jsonServer.create();
const router = jsonServer.router(db);
const middlewares = jsonServer.defaults();

const wellKnownUri = process.env['DCID_WELLKNOWN'];
const audience = process.env['DCID_CLIENT_ID'];
const users = process.env['ALLOWED_USERS'] || '*';

if (!wellKnownUri) {
  console.error('DCID_WELLKNOWN variable unset');
  process.exit(1);
}
if (!audience) {
  console.error('DCID_CLIENT_ID variable unset');
  process.exit(1);
}

server.use(middlewares);
server.use(jsonServer.bodyParser);
const backend = new PrivateBetaMock();

const configurePassport = async () => {
  const { issuer, jwksUri } = await getWellKnownParams(wellKnownUri);

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKeyProvider: jwksRsa.passportJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 2,
      jwksUri,
    }),
    issuer,
    audience,
    algorithms: ['RS256'] as Algorithm[],
  };

  passport.use(
    new JwtStrategy(opts, async (jwtPayload, done) => {
      let filter =
        users === '*'
          ? userFilter.any
          : userFilter.uniqueReferenceString(users);

      if (
        process.env['FEATURE_PRIVATE_AUDIENCE_CHECKS'] &&
        process.env['FEATURE_PRIVATE_AUDIENCE_CHECKS'] === 'true'
      ) {
        filter = userFilter.or(filter, backend.userFilter);
      }
      const validationResult = await validateToken(filter)(jwtPayload);
      if (validationResult && validationResult.isValid) {
        return done(null, validationResult);
      } else {
        return done(null, false);
      }
    })
  );

  server.use(passport.initialize());
  server.use(passport.authenticate('jwt', { session: false }));
};

const registerPlugins = () => {
  new AddressPlugin(server, '/api/addresses', db).register();
  new FeedbackPlugin(server, '/api/feedback').register();
  new ReferenceDataPlugin(server, '/api/reference-data', db).register();
  new SubmissionPlugin(server, '/api/submissions').register();
  new TemplatePlugin(server, '/api/templates').register();
  new BulkSubmissionPlugin(server, '/api/batches').register();
  new PrivateBetaPlugin(server, '/api/private-beta', backend).register();
};

(async () => {
  await configurePassport();
  registerPlugins();

  server.use(router);
  server.listen(3000, () => {
    console.log(`JSON Server is running on port 3000`);
  });
})();
