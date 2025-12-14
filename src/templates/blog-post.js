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
  researchers: {
    margin: "20px 0 30px 0",
    padding: "15px 0",
    borderTop: "1px solid",
    borderBottom: "1px solid",
    borderColor: "muted",
  },
  researcherItem: {
    marginBottom: "12px",
    "&:last-child": {
      marginBottom: "0",
    },
  },
  researcherName: {
    fontWeight: "600",
    marginRight: "8px",
  },
  researcherTitle: {
    fontStyle: "italic",
    color: "muted",
    fontSize: "0.9em",
  },
  researcherAffiliation: {
    color: "muted",
    fontSize: "0.9em",
    marginLeft: "8px",
  },
  researcherLink: {
    color: "primary",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
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

// New Researchers component
const Researchers = ({ researchers }) => {
  if (!researchers || researchers.length === 0) {
    return null
  }

  return (
    <div sx={styles.researchers}>
      <h3 sx={{ marginBottom: "15px", fontSize: "1.1rem" }}>Researchers</h3>
      {researchers.map((researcher, index) => (
        <div key={index} sx={styles.researcherItem}>
          {researcher.profileUrl ? (
            <a
              href={researcher.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={styles.researcherLink}
            >
              <span sx={styles.researcherName}>{researcher.name}</span>
            </a>
          ) : (
            <span sx={styles.researcherName}>{researcher.name}</span>
          )}
          {researcher.title && (
            <span sx={styles.researcherTitle}> • {researcher.title}</span>
          )}
          {researcher.affiliation && (
            <span sx={styles.researcherAffiliation}>({researcher.affiliation})</span>
          )}
        </div>
      ))}
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
          affiliation
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
