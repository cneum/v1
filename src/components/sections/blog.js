import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-size: var(--fz-sm);
    padding: 10px 0px;
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    a {
      position: relative;
      z-index: 1;
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 40px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  &:hover,
  &:focus-within {
    .project-inner {
      transform: translateY(-7px);
    }
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    background-color: var(--red);
    -webkit-filter: grayscale(15%);
    transition: var(--transition);
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: black;
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;
        color: white;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: black;
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-description {
    color: black;
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-style: oblique;
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const Blog = () => {
  const data = useStaticQuery(graphql`
    query {
      blog: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/blog/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
            }
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealBlog = useRef([]);

  useEffect(() => {
    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealBlog.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const blog = data.blog.edges.filter(({ node }) => node);
  const firstSix = blog.slice(0, GRID_LIMIT);
  const blogToShow = showMore ? blog : firstSix;

  return (
    <section id="blog">
      <StyledProjectsSection>
        <h2 className="numbered-heading" ref={revealTitle}>
          My Blog
        </h2>
        <ul className="projects-grid">
          <TransitionGroup component={null}>
            {blogToShow &&
              blogToShow.map(({ node }, i) => {
                const { frontmatter, html } = node;
                const { github, external, title, tech } = frontmatter;

                return (
                  <CSSTransition
                    key={i}
                    classNames="fadeup"
                    timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                    exit={false}
                  >
                    <StyledProject
                      key={i}
                      ref={el => (revealBlog.current[i] = el)}
                      style={{
                        transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                      }}
                    >
                      <div className="project-inner">
                        <header>
                          <div className="project-top">
                            <div className="folder">
                              <Icon name="Folder" />
                            </div>
                            <div className="project-links">
                              {github && (
                                <a href={github} aria-label="GitHub Link">
                                  <Icon name="GitHub" />
                                </a>
                              )}
                              {external && (
                                <a href={external} aria-label="External Link" className="external">
                                  <Icon name="External" />
                                </a>
                              )}
                            </div>
                          </div>

                          <h3 className="project-title">
                            <a href={external}>{title}</a>
                          </h3>

                          <div
                            className="project-description"
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        </header>

                        <footer>
                          {tech && (
                            <ul className="project-tech-list">
                              {tech.map((tech, i) => (
                                <li key={i}>{tech}</li>
                              ))}
                            </ul>
                          )}
                        </footer>
                      </div>
                    </StyledProject>
                  </CSSTransition>
                );
              })}
          </TransitionGroup>
        </ul>

        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Show {showMore ? 'Less' : 'More'}
        </button>
        <Link className="inline-link archive-link" to="/archive" ref={revealArchiveLink}>
          view the archive
        </Link>
      </StyledProjectsSection>
    </section>
  );
};

export default Blog;