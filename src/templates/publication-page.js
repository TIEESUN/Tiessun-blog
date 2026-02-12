/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import Layout from "../components/layout";
import Seo from "../components/seo";

export const pageQuery = graphql`
  query PublicationQuery {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { template: { eq: "publication-page" } } }
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
  const [query, setQuery] = React.useState("");

  const filteredPublications = publications.filter(({ node }) =>
    node.frontmatter.title
      ?.toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <Layout>
      <Seo title="Publications" />

      <div sx={{ maxWidth: "1200px", mx: "auto", px: 3, py: 4 }}>
        <h1 sx={{ mb: 3 }}>Publications</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search publications..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            mb: 4,
            px: 3,
            py: 2,
            width: "100%",
            maxWidth: "400px",
            borderRadius: "6px",
            border: "1px solid",
            borderColor: "gray",
            fontSize: 1,
          }}
        />

        {/* Responsive table wrapper */}
        <div sx={{ overflowX: "auto" }}>
          <table
            sx={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              bg: "background",
              borderRadius: "10px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
              overflow: "hidden",
              minWidth: "800px",
            }}
          >
            <thead>
              <tr>
                {["Title", "Abstract", "Link", "Date"].map((heading) => (
                  <th
                    key={heading}
                    sx={{
                      textAlign: "left",
                      px: 3,
                      py: 3,
                      fontSize: 1,
                      fontWeight: "bold",
                      bg: "muted",
                      borderBottom: "1px solid",
                      borderColor: "gray",
                    }}
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredPublications.map(({ node }, index) => {
                const { title, abstract, link, date } = node.frontmatter;

                return (
                  <tr
                    key={node.id}
                    sx={{
                      bg: index % 2 === 0 ? "background" : "highlight",
                      transition: "background-color 0.2s ease",
                      "&:hover": {
                        bg: "muted",
                      },
                    }}
                  >
                    <td sx={{ px: 3, py: 3, fontWeight: 600 }}>
                      {title || "Untitled"}
                    </td>

                    <td
                      sx={{
                        px: 3,
                        py: 3,
                        color: "gray",
                        fontSize: 1,
                        lineHeight: "1.6",
                        maxWidth: "500px",
                      }}
                    >
                      {abstract || "No abstract available"}
                    </td>

                    <td sx={{ px: 3, py: 3 }}>
                      {link ? (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: "inline-block",
                            px: 3,
                            py: 1,
                            borderRadius: "6px",
                            bg: "primary",
                            color: "background",
                            fontSize: 0,
                            fontWeight: "bold",
                            textDecoration: "none",
                            "&:hover": {
                              bg: "secondary",
                            },
                          }}
                        >
                          View
                        </a>
                      ) : (
                        <span sx={{ color: "gray" }}>—</span>
                      )}
                    </td>

                    <td sx={{ px: 3, py: 3, whiteSpace: "nowrap" }}>
                      {date || "Unknown date"}
                    </td>
                  </tr>
                );
              })}

              {filteredPublications.length === 0 && (
                <tr>
                  <td colSpan="4" sx={{ px: 3, py: 4, textAlign: "center" }}>
                    No publications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default PublicationPage;
