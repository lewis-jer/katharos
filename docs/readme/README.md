# Katharos Framework Documentation

This directory contains ReadMe.io-compatible documentation for the katharos framework.

## Documentation Structure

```
docs/readme/
├── Introduction.md          # Framework overview and key features
├── Getting-Started.md       # Step-by-step setup guide
├── Authentication.md        # User management and auth patterns
├── API-Reference/          # Detailed API documentation
│   ├── Interface.md        # Main Interface class API
│   ├── System.md          # System module API (pending)
│   ├── Store.md           # Store module API (pending)
│   ├── User.md            # User module API (pending)
│   └── Plugin.md          # Plugin API reference (pending)
├── Guides/                 # In-depth guides
│   ├── Plugin-Development.md    # Creating plugins
│   ├── State-Management.md      # Using the store (pending)
│   ├── Advanced-Plugins.md      # Complex patterns (pending)
│   └── Page-Routing.md          # Routing guide (pending)
├── Tutorials/              # Hands-on tutorials
│   ├── Todo-App.md        # Build a todo app (pending)
│   └── Form-Handling.md   # Form management (pending)
├── CHANGELOG.md           # Documentation changes
├── table_of_contents.json # Structure metadata
├── docs-config.json       # Configuration
└── README.md             # This file
```

## ReadMe.io Integration

### Uploading to ReadMe.io

1. **Manual Upload**: 
   - Log into your ReadMe.io dashboard
   - Navigate to your project
   - Upload each markdown file to the appropriate section
   - Use the table_of_contents.json to maintain proper ordering

2. **API Upload** (if README_API_KEY is set):
   ```bash
   # Example script to sync with ReadMe.io
   rdme docs ./docs/readme --key=$README_API_KEY --version=v1.0
   ```

### Formatting Guidelines

All documentation follows ReadMe.io formatting standards:
- H2 (`##`) for main sections
- H3 (`###`) for subsections
- Fenced code blocks with language tags
- Tables for parameter documentation
- Internal links use relative paths

## Automated Documentation

This documentation is maintained by an automated agent that:
- Monitors code changes
- Updates documentation on commits
- Maintains consistency across all docs
- Logs all changes to `.cursor/logs/`

### Configuration

Edit `docs-config.json` to customize:
- Output format and directory
- Sync strategy
- Code sample generation
- API reference style

### Logs and Metrics

- **Logs**: `.cursor/logs/doc-agent.log`
- **Metrics**: `.cursor/logs/doc-metrics.json`

## Contributing

When adding new features to katharos:
1. The documentation agent will detect changes
2. New documentation will be generated automatically
3. Review the generated docs for accuracy
4. Commit both code and documentation changes

## Current Status

✅ **Completed**:
- Introduction and overview
- Getting started guide
- Authentication patterns
- Interface API reference
- Plugin development guide
- Documentation structure

⏳ **Pending**:
- System, Store, User, Plugin API references
- State management guide
- Advanced plugin patterns
- Page routing guide
- Tutorial examples

## Support

For documentation issues:
- Check `.cursor/logs/doc-agent.log` for errors
- Review the CHANGELOG.md for recent updates
- Create an issue if documentation is incorrect or missing