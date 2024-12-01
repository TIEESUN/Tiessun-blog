/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";

export const pageQuery = graphql`
  query PublicationQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { template: { eq: "publication" } } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            abstract
            link
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;

const PublicationPage = ({ data }) => {
  const publications = data.allMarkdownRemark.edges;

  return (
    <Layout>
      <Seo title="Publications" />
      <div className="publication-page">
        <h1>Publications</h1>
        <table
          sx={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "2rem",
          }}
        >
          <thead>
            <tr>
              <th
                sx={{
                  borderBottom: "1px solid",
                  textAlign: "left",
                  padding: "8px",
                }}
              >
                Title
              </th>
              <th
                sx={{
                  borderBottom: "1px solid",
                  textAlign: "left",
                  padding: "8px",
                }}
              >
                Abstract
              </th>
              <th
                sx={{
                  borderBottom: "1px solid",
                  textAlign: "left",
                  padding: "8px",
                }}
              >
                Link
              </th>
              <th
                sx={{
                  borderBottom: "1px solid",
                  textAlign: "left",
                  padding: "8px",
                }}
              >
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {publications.map(({ node }) => {
              const { title, abstract, link, date } = node.frontmatter;
              return (
                <tr key={node.id}>
                  <td
                    sx={{
                      borderBottom: "1px solid",
                      padding: "8px",
                    }}
                  >
                    {title || "Untitled"}
                  </td>
                  <td
                    sx={{
                      borderBottom: "1px solid",
                      padding: "8px",
                    }}
                  >
                    {abstract || "No abstract available"}
                  </td>
                  <td
                    sx={{
                      borderBottom: "1px solid",
                      padding: "8px",
                    }}
                  >
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      "No link available"
                    )}
                  </td>
                  <td
                    sx={{
                      borderBottom: "1px solid",
                      padding: "8px",
                    }}
                  >
                    {date || "Unknown date"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default PublicationPage;
