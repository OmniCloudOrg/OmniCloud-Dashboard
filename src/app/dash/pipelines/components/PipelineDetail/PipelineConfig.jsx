"use client"

import React from 'react';
import { Github, Server, Shield } from 'lucide-react';
import { StatusBadge } from '../../../../../components/ui';

const PipelineConfig = ({ pipeline }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <button className="text-blue-400 hover:text-blue-300 text-sm">
          Edit Configuration
        </button>
      </div>
      
      <div className="bg-slate-800/50 p-4 rounded-lg">
        <h3 className="text-sm font-medium text-slate-300 mb-3">Pipeline Configuration</h3>
        <pre className="font-mono text-sm text-slate-300 p-4 bg-slate-900 rounded-lg overflow-x-auto">
          {`name: ${pipeline.name}
version: 1.0.0
repository: ${pipeline.repository}
branch: ${pipeline.branch}

triggers:
  - push:
      branches: [main, develop]
  - pull_request:
      branches: [main, develop]

stages:
  - name: build
    jobs:
      - name: build-app
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v3
          - uses: actions/setup-node@v3
            with:
              node-version: '18'
          - run: npm ci
          - run: npm run build
          - run: npm test

  - name: deploy
    jobs:
      - name: deploy-staging
        runs-on: ubuntu-latest
        needs: build-app
        if: success() && github.ref == 'refs/heads/develop'
        steps:
          - uses: actions/checkout@v3
          - name: Deploy to Staging
            run: ./deploy.sh staging

      - name: deploy-production
        runs-on: ubuntu-latest
        needs: build-app
        if: success() && github.ref == 'refs/heads/main'
        steps:
          - uses: actions/checkout@v3
          - name: Deploy to Production
            run: ./deploy.sh production`}
        </pre>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Environment Variables</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
              <div className="font-mono text-sm text-blue-400">NODE_ENV</div>
              <div className="font-mono text-sm text-green-400">production</div>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
              <div className="font-mono text-sm text-blue-400">API_URL</div>
              <div className="font-mono text-sm text-green-400">https://api.example.com</div>
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
              <div className="font-mono text-sm text-blue-400">DEPLOY_TOKEN</div>
              <div className="font-mono text-sm text-slate-500">**************</div>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-slate-300 mb-3">Integrations</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
              <div className="flex items-center gap-2">
                <Github size={16} className="text-slate-400" />
                <span className="text-sm text-slate-300">GitHub</span>
              </div>
              <StatusBadge status="success" />
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
              <div className="flex items-center gap-2">
                <Server size={16} className="text-slate-400" />
                <span className="text-sm text-slate-300">Deployment</span>
              </div>
              <StatusBadge status="success" />
            </div>
            <div className="flex justify-between items-center p-2 bg-slate-900 rounded">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-slate-400" />
                <span className="text-sm text-slate-300">Security Scan</span>
              </div>
              <StatusBadge status="success" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { PipelineConfig };