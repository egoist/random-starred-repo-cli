#!/usr/bin/env node
'use strict'
const cac = require('cac')
const random = require('random-starred-repo')
const Conf = require('conf')
const chalk = require('chalk')
const Spin = require('io-spin')
const figures = require('figures')

const config = new Conf()
const cli = cac()

const get = input => {
  const username = input[0] || config.get('github')
  if (!username) {
    console.log(chalk.red('Please set your GitHub username! Run `rsr set <username> [token]`'))
    return
  }
  const spin = new Spin(`Fetching a random repo for ${username}`)
  const token = config.get('token')
  spin.start()
  return random(username, token)
    .then(repo => {
      spin.stop()
      console.log(`\n  ${chalk.cyan(repo.full_name)} ${chalk.yellow(figures.star)} ${chalk.yellow(repo.stargazers_count)}`)
      if (repo.description) {
        console.log(`  ${chalk.green(repo.description)}`)
      }
      console.log(`  ${chalk.grey(repo.html_url)}\n`)
    })
    .catch(err => {
      spin.stop()
      console.error(err.stack)
    })
}

const set = input => {
  const username = input[1]
  const token = input[2]
  if (username) {
    config.set('username', username)
  }
  if (token) {
    config.set('token', token)
  }
  console.log(chalk.green(`username ${username} and token ${token} have benn saved!`))
}

cli
  .command('*', 'Get a random starred repo', get)
  .command('set', 'Set GitHub username and token', set)
  .parse()
