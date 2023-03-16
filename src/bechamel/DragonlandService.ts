import fetch from 'isomorphic-fetch'
import { Challenge, GameResponse } from "./types"

export class DragonlandService {
  private cookie: string = ''
  constructor(private readonly address: string) {}

  public async login(login: string, password: string) {
    const params = new URLSearchParams({
      username: login,
      password,
    })
    try {
      const response = await fetch(`${this.address}/users/login`, {
        method: 'POST',
        credentials: 'include',
        body: params,
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Cache-Control': 'no-cache',
          'Origin': this.address,
          'Host': 'localhost:3000',
          'Referer': `${this.address}/users/login`,
        },
        redirect: 'manual',
      })
      
      if (response.redirected && response.url.includes('loginError')) {
        throw new Error(`Failed to login as ${params.toString()}`)  
      }
      const cookie = await response.headers.get('Set-Cookie')
      if (cookie) {
        console.log(`Got cookie ${cookie}`)
        this.cookie = cookie.split(';')[0]
      } else {
        console.log('No cookie!')
      }
      const loggedRes = await fetch(response.url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Origin': this.address,
          'Host': 'localhost:3000',
          'Cookie': this.cookie,
        },
      })

      const loggedBody = await loggedRes.text()
      console.log(loggedBody)
    } catch(e) {
      console.dir(e)
      throw new Error(`Failed to login as ${login}`)
    }
   }

  public async getChallenges(): Promise<GameResponse|Challenge[]> {
    try {
      console.log(`Getting challenges with cookie ${this.cookie}`)
      const response = await fetch(`${this.address}/api/challenges`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cookie': this.cookie,
          'Referer': `${this.address}/`,
          'Host': 'localhost:3000',
        },
      })
      if (response.redirected) {
        const text = await response.text()
        console.dir(text)
        throw new Error('Failed to fetch challenges, redirect')
      }
      const data = await response.json()

      return data as GameResponse|Challenge[]
    } catch(e) {
      console.dir(e)
      throw new Error('Failed to fetch challenges')
    }
  }

  public async acceptChallenge(name: string, deckId: string): Promise<string|null> {
    try {
      const response = await fetch(`${this.address}/api/accept`, {
        method: 'POST',
        headers: {
          Cookie: this.cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          deckId,
        }, null, 2),
      })
      const data = await response.json()

      return data.hash || null
    } catch(e) {
      console.dir(e)
      throw new Error('Failed to accept the challenge')
    }
  }

  public async createChallenge(deckId: string): Promise<null> {
    try {
      const response = await fetch(`${this.address}/api/challenges`, {
        method: 'POST',
        headers: {
          Cookie: this.cookie,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deckId,
        }, null, 2),
      })

      return null
    } catch(e) {
      console.dir(e)
      throw new Error('Failed to create the challenge')
    }
  }

  public async waitForGame(callback: (gameHash: string) => Promise<void>) {
    console.log('Waiting for the challenger')
    const timer = setInterval(async () => {
      const challenges = await this.getChallenges()

      if ('hash' in challenges) {
        clearInterval(timer)
        callback(challenges.hash)
        console.log('Game found, stopping the watcher')
      }
    }, 3000)

  }

  public async accessGame(playerHash: string): Promise<void> {
    await fetch(`${this.address}/api/game/${playerHash}`, {
      method: 'GET',
      headers: {
        Cookie: this.cookie,
      },
    })
  }

  public setCookie(cookie: string) {
    this.cookie = cookie
  }
}