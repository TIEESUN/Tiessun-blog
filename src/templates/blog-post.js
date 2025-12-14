/** @jsx jsx */
import { jsx } from "theme-ui"
import { Link, graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"
import { RiArrowRightLine, RiArrowLeftLine } from "react-icons/ri"

import Layout from "../components/layout"
import Seo from "../components/seo"

const styles = {
  "article blockquote": {
    "background-color": "cardBg",
  },
  pagination: {
    a: {
      color: "muted",
      "&.is-active": {
        color: "text",
      },
      "&:hover": {
        color: "text",
      },
    },
  },
  researchersContainer: {
    margin: "20px 0 30px 0",
    padding: "20px 0",
    borderTop: "1px solid",
    borderBottom: "1px solid",
    borderColor: "muted",
  },
  researchersHeading: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "20px",
    color: "text",
  },
  researchersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "25px",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    },
  },
  researcherCard: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  researcherName: {
    fontSize: "1.1rem",
    fontWeight: "600",
    marginBottom: "5px",
    color: "text",
    textDecoration: "none",
    "&:hover": {
      color: "primary",
      textDecoration: "underline",
    },
  },
  researcherTitle: {
    fontSize: "0.9rem",
    color: "muted",
    fontStyle: "italic",
    lineHeight: "1.4",
  },
}

const Pagination = props => (
  <div className="pagination -post" sx={styles.pagination}>
    <ul>
      {props.previous && props.previous.frontmatter.template === "blog-post" && (
        <li>
          <Link to={props.previous.frontmatter.slug} rel="prev">
            <p
              sx={{
                color: "muted",
              }}
            >
              <span className="icon -left">
                <RiArrowLeftLine />
              </span>{" "}
              Previous
            </p>
            <span className="page-title">
              {props.previous.frontmatter.title}
            </span>
          </Link>
        </li>
      )}
      {props.next && props.next.frontmatter.template === "blog-post" && (
        <li>
          <Link to={props.next.frontmatter.slug} rel="next">
            <p
              sx={{
                color: "muted",
              }}
            >
              Next{" "}
              <span className="icon -right">
                <RiArrowRightLine />
              </span>
            </p>
            <span className="page-title">{props.next.frontmatter.title}</span>
          </Link>
        </li>
      )}
    </ul>
  </div>
)

// New Researchers component - SIMPLIFIED VERSION
const Researchers = ({ researchers }) => {
  if (!researchers || researchers.length === 0) {
    return null
  }

  return (
    <div sx={styles.researchersContainer}>
      <h3 sx={styles.researchersHeading}>Researchers</h3>
      <div sx={styles.researchersGrid}>
        {researchers.map((researcher, index) => (
          <div key={index} sx={styles.researcherCard}>
            {researcher.profileUrl ? (
              <a
                href={researcher.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={styles.researcherName}
              >
                {researcher.name}
              </a>
            ) : (
              <div sx={styles.researcherName}>
                {researcher.name}
              </div>
            )}
            {researcher.title && (
              <div sx={styles.researcherTitle}>
                {researcher.title}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const Post = ({ data, pageContext }) => {
  const { markdownRemark } = data // data.markdownRemark holds your post data
  const { frontmatter, html, excerpt } = markdownRemark

  const Image = frontmatter.featuredImage
    ? frontmatter.featuredImage.childImageSharp.gatsbyImageData
    : ""
  const { previous, next } = pageContext
  const researchers = frontmatter.researchers || []

  let props = {
    previous,
    next,
  }

  return (
    <Layout className="page">
      <Seo
        title={frontmatter.title}
        description={
          frontmatter.description ? frontmatter.description : excerpt
        }
        image={Image}
        article={true}
      />
      <article className="blog-post">
        <header className="featured-banner">
          <section className="article-header">
            <h1>{frontmatter.title}</h1>
            <time sx={{color: "muted"}}>{frontmatter.date}</time>
          </section>
          
          {/* Add Researchers component here - after the date */}
          <Researchers researchers={researchers} />
          
          {Image ? (
            <GatsbyImage
              image={Image}
              alt={frontmatter.title + " - Featured image"}
              className="featured-image"
            />
          ) : (
            ""
          )}
        </header>

        <div
          className="blog-post-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </article>
      {(previous || next) && <Pagination {...props} />}
    </Layout>
  )
}

export default Post

export const pageQuery = graphql`
  query BlogPostQuery($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      excerpt(pruneLength: 148)
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        slug
        title
        description
        researchers {
          name
          title
          profileUrl
        }
        featuredImage {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
  }
`
