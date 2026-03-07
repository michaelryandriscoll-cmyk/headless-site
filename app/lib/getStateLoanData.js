// app/lib/getStateLoanData.js
export async function getStateLoanData(stateSlug) {
  const res = await fetch(process.env.WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `
        query StateLoan($slug: ID!) {
          stateLoan(id: $slug, idType: SLUG) {
            title
            slug
            stateLoanFields {
              subtitle
              overview
              creditScore
              processingTime
              avgApr
              stateCode
              loanQualificationRequirements {
                requirementItem
              }
              loanPrograms {
                programName
                description
                minMaxFunding
                termLength
                applyLink {
                  url
                }
              }
              nearbyCities {
                cityName
                slug
              }
            }
          }
        }
      `,
      variables: { slug: stateSlug }
    })
  });

  const json = await res.json();
  return json?.data?.stateLoan || null;
}