export async function getWellKnownParams(
  uri: string,
): Promise<{ issuer: string; jwksUri: string }> {
  const response = await fetch(uri);
  const body = await response.json();
  return { issuer: body.issuer, jwksUri: body.jwks_uri };
}
