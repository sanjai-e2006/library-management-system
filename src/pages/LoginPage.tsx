import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabaseClient } from '../supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      if (!supabaseClient) {
        // Mock authentication when Supabase not configured
        await new Promise(resolve => setTimeout(resolve, 800)) // Simulate API call
        const mockUser = { 
          role: email.includes('admin') || email.includes('librarian') ? 'admin' : 'student',
          email 
        }
        localStorage.setItem('user', JSON.stringify(mockUser))
        if (mockUser.role === 'admin') navigate('/admin')
        else navigate('/student')
        return
      }
      
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      
      const role = (data.user?.user_metadata as any)?.role || 'student'
      const user = { role, email: data.user?.email }
      localStorage.setItem('user', JSON.stringify(user))
      
      if (role === 'admin') navigate('/admin')
      else navigate('/student')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (userType: 'student' | 'admin') => {
    setEmail(`${userType}@library.edu`)
    setPassword('demo123')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1 className="login-title">🏛️ Library BI</h1>
          <p className="login-subtitle">Business Intelligence Dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div className="alert alert-error">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div className="demo-accounts">
            <h4>🚀 Quick Demo Access</h4>
            <div className="demo-account">
              <span className="demo-account-type">👨‍🎓 Student</span>
              <button
                type="button"
                className="demo-account-email"
                onClick={() => fillDemoCredentials('student')}
              >
                student@library.edu
              </button>
            </div>
            <div className="demo-account">
              <span className="demo-account-type">👨‍💼 Admin</span>
              <button
                type="button"
                className="demo-account-email"
                onClick={() => fillDemoCredentials('admin')}
              >
                admin@library.edu
              </button>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--gray-500)', marginTop: '12px', textAlign: 'center' }}>
              Password: <code>demo123</code> | Click email to auto-fill
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-lg ${loading ? 'loading' : ''}`}
            disabled={loading}
            style={{ width: '100%' }}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '12px', color: 'var(--gray-500)' }}>
          <p>Built with React + TypeScript + Chart.js</p>
          <p>Modern Business Intelligence Dashboard</p>
        </div>
      </div>
    </div>
  )
}
