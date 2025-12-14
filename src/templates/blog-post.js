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
    margin: "8px 0 20px 0",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    width: "100%",
  },
  researcherName: {
    fontSize: "1rem",
    fontWeight: "600",
    color: "primary",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  comma: {
    color: "muted",
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

const Researchers = ({ researchers }) => {
  if (!researchers || researchers.length === 0) {
    return null
  }

  return (
    <div sx={styles.researchersContainer}>
      {researchers.map((researcher, index) => {
        const isLast = index === researchers.length - 1
        
        return (
          <span key={index}>
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
              <span sx={styles.researcherName}>
                {researcher.name}
              </span>
            )}
            {!isLast && <span sx={styles.comma}>,</span>}
          </span>
        )
      })}
    </div>
  )
}

const Post = ({ data, pageContext }) => {
  const { markdownRemark } = data
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
          <section className="article-header" style={{ textAlign: "center" }}>
            <h1>{frontmatter.title}</h1>
            <time sx={{color: "muted", display: "block"}}>
              {frontmatter.date}
            </time>
            <Researchers researchers={researchers} />
          </section>
          
          {Image ? (
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <GatsbyImage
                image={Image}
                alt={frontmatter.title + " - Featured image"}
                className="featured-image"
                imgStyle={{
                  maxWidth: "100%",
                  height: "auto",
                }}
              />
            </div>
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
            gatsbyImageData(
              layout: CONSTRAINED
              width: 1200
              quality: 90
              formats: [AUTO, WEBP, AVIF]
            )
          }
        }
      }
    }
  }
`
