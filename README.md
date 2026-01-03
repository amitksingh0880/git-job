# GitHub Auto-Contribution System

An automated system that makes legitimate daily contributions to your GitHub repository to maintain consistent activity on your contribution graph.

Built with **TypeScript** for type safety and maintainability.

## 🌟 Features

- **Automated Daily Contributions**: Runs automatically every day at 11:00 PM IST
- **Legitimate Content**: Generates meaningful content including:
  - 📚 TIL (Today I Learned) notes
  - 💻 Code snippets and utilities
  - 📝 Technical notes and research
  - 📊 Project progress updates
- **GitHub Actions**: Runs in the cloud, no local machine required
- **Zero Maintenance**: Set it and forget it
- **Variety**: Different content types to keep contributions interesting

## 🚀 Quick Start

### 1. Initial Setup

This repository is already configured! Just push it to GitHub:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit initial setup
git commit -m "Initial setup: GitHub auto-contribution system"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/git-job.git

# Push to GitHub
git push -u origin main
```

### 2. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on the **"Actions"** tab
3. If prompted, click **"I understand my workflows, go ahead and enable them"**
4. The workflow will now run automatically every day at 10:00 AM IST

### 3. Manual Test (Optional)

To test the workflow immediately:

1. Go to **Actions** tab on GitHub
2. Click on **"Daily GitHub Contribution"** workflow
3. Click **"Run workflow"** button
4. Select the branch (main) and click **"Run workflow"**

### 4. Local Testing (Optional)

Test the script locally before pushing:

```bash
cd d:\Project-26\git-job
npm install
npm run contribute
```

## 📁 Project Structure

```
git-job/
├── .github/
│   └── workflows/
│       └── daily-contribution.yml    # GitHub Actions workflow
├── contributions/                     # Generated contributions stored here
│   └── YYYY-MM-DD-type.md            # Daily contribution files
├── dist/                              # Compiled JavaScript (generated)
├── contribute.ts                      # Main contribution script (TypeScript)
├── package.json                       # Project configuration
├── tsconfig.json                      # TypeScript configuration
├── .gitignore                        # Git ignore rules
└── README.md                         # This file
```

## 🎯 How It Works

1. **Scheduled Execution**: GitHub Actions runs the workflow daily at 10:00 AM IST (4:30 AM UTC)
2. **Content Generation**: The script randomly selects a contribution type and generates relevant content
3. **File Creation**: Creates a markdown file in the `contributions/` directory with the date and type
4. **Git Operations**: Commits and pushes the new file to the repository
5. **GitHub Graph Update**: Your contribution graph updates automatically!

## 📝 Contribution Types

### TIL (Today I Learned)
Daily learning notes about programming concepts, tools, and best practices.

**Example topics:**
- JavaScript array methods
- Git workflows
- CSS techniques
- Database optimization

### Code Snippets
Reusable code utilities and functions.

**Example snippets:**
- Debounce function
- Deep clone object
- Retry with backoff
- Format utilities

### Technical Notes
In-depth notes on technical topics and architectures.

**Example topics:**
- Microservices patterns
- Security best practices
- Performance optimization
- System design

### Progress Updates
Daily progress logs and accomplishments.

**Example updates:**
- Code refactoring
- Bug fixes
- Documentation updates
- Feature implementations

## ⚙️ Configuration

### Change Schedule Time

Edit `.github/workflows/daily-contribution.yml`:

```yaml
on:
  schedule:
    # Change the cron expression
    # Format: 'minute hour day month weekday'
    # Example: '0 14 * * *' = 2:00 PM UTC daily
    - cron: '30 17 * * *'  # Current: 11:00 PM IST
```

**Cron time converter**: Use [crontab.guru](https://crontab.guru/) to generate cron expressions.

### Customize Content

Edit `contribute.ts` to add your own content templates:

1. Find the `CONTENT_GENERATORS` object
2. Add new topics, snippets, or notes to the arrays
3. Run `npm run build` to compile
4. Commit and push your changes

## 🔍 Monitoring

### View Workflow Runs

1. Go to **Actions** tab on GitHub
2. Click on any workflow run to see details
3. Check logs for success/failure messages

### Check Contributions

1. Visit your GitHub profile
2. Your contribution graph will show daily activity
3. Browse the `contributions/` directory to see generated files

## 🛠️ Troubleshooting

### Workflow Not Running

- **Check Actions are enabled**: Go to Settings → Actions → General
- **Verify workflow file**: Ensure `.github/workflows/daily-contribution.yml` exists
- **Check permissions**: Repository needs write permissions for Actions

### No Commits Appearing

- **Check workflow logs**: Look for error messages in Actions tab
- **Verify git config**: Ensure git user is configured in workflow
- **Check branch**: Make sure you're pushing to the correct branch

### Manual Run

If automatic scheduling isn't working, you can manually trigger:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/git-job.git
cd git-job

# Install dependencies
npm install

# Run the script
npm run contribute

# Push changes
git push
```

## 📊 Benefits

- ✅ **Consistent Activity**: Maintain an active GitHub profile
- ✅ **Learning Documentation**: Track daily learning progress
- ✅ **Code Library**: Build a collection of useful snippets
- ✅ **Professional Image**: Show consistent commitment to coding
- ✅ **Zero Effort**: Fully automated, no manual work needed

## 🔒 Privacy & Security

- All content is generated locally by the script
- No external API calls or data collection
- Uses GitHub's built-in Actions (no third-party services)
- All code is open source and auditable

## 📄 License

MIT License - feel free to use and modify as needed!

## 🤝 Contributing

This is a personal automation tool, but feel free to fork and customize for your own use!

## ⚠️ Disclaimer

This tool generates legitimate, meaningful content for learning and documentation purposes. It's designed to help maintain consistent GitHub activity while actually providing value through learning notes and code snippets.

---

**Happy Contributing! 🎉**

*Automated contributions made easy with GitHub Actions*
