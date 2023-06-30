import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Footer = () => (
  <footer>
    <a href="https://github.com/vincerubinetti/svg-to-png" target="_blank">
      <FontAwesomeIcon icon={faGithub} style={{ marginRight: "0.5em" }} />
      Source code and help
    </a>
  </footer>
);

export default Footer;
