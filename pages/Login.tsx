import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, Button, GlassCard } from '../components/UI';
import { api } from '../services/api';
import { User as UserType } from '../types';
import { Scissors, Shield, User } from 'lucide-react';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Mocking Auth for both flows
      const user = await api.login(formData.email, formData.password);
      onLogin(user);
    } catch (error) {
      console.error(error);
      alert("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (role: 'ADMIN' | 'CLIENT') => {
    setLoading(true);
    try {
      // Credentials matching api.ts logic
      const email = role === 'ADMIN' ? 'admin@darkveil.com' : 'client@darkveil.com';
      const password = role === 'ADMIN' ? 'admin' : 'password';
      
      const user = await api.login(email, password);
      onLogin(user);
    } catch (error) {
       console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gold-50 dark:bg-darkveil-950 flex flex-col justify-center items-center p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Ambience - Old Money Green/Gold */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-gold-200 dark:bg-darkveil-800 rounded-full blur-[120px] opacity-60" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-gold-300/20 dark:bg-gold-600/10 rounded-full blur-[120px]" />

      <GlassCard className="w-full max-w-md p-8 z-10 border-gold-500/10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-600 to-gold-400 dark:to-darkveil-950 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-gold-900/20 border border-gold-500/20">
            <Scissors className="text-darkveil-900 dark:text-gold-200 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-darkveil-900 to-darkveil-700 dark:from-gold-100 dark:to-gold-400">
            DarkVeil
          </h1>
          <p className="text-gold-600 dark:text-gold-500/60 text-xs tracking-[0.2em] uppercase mt-2 font-medium">Gentleman's Quarters</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <Input 
                placeholder="Full Name" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required={!isLogin}
              />
              <Input 
                placeholder="WhatsApp Number" 
                type="tel"
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                required={!isLogin}
              />
            </>
          )}
          
          <Input 
            placeholder="Email Address" 
            type="email"
            value={formData.email}
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
          <Input 
            placeholder="Password" 
            type="password"
            value={formData.password}
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />

          <Button type="submit" isLoading={loading} className="w-full mt-4">
            {isLogin ? 'Sign In' : 'Join Membership'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-500 dark:text-gray-400 text-sm hover:text-darkveil-900 dark:hover:text-gold-300 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already a member? Sign In"}
          </button>
        </div>

        {/* Dev Tools / Quick Login */}
        <div className="mt-8 pt-6 border-t border-darkveil-900/10 dark:border-white/5">
          <p className="text-xs text-center text-gray-500 dark:text-gray-600 uppercase tracking-widest mb-3">Dev Quick Access</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleTestLogin('ADMIN')}
              disabled={loading}
              className="flex flex-col items-center justify-center p-3 rounded bg-red-100 dark:bg-red-900/10 hover:bg-red-200 dark:hover:bg-red-900/20 border border-red-500/10 dark:border-red-900/20 transition-colors group"
            >
              <Shield className="w-4 h-4 text-red-600 dark:text-red-800 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] text-red-700 dark:text-red-800/70 font-bold">ADMIN</span>
            </button>
            <button 
               onClick={() => handleTestLogin('CLIENT')}
               disabled={loading}
               className="flex flex-col items-center justify-center p-3 rounded bg-gold-100 dark:bg-gold-900/10 hover:bg-gold-200 dark:hover:bg-gold-900/20 border border-gold-500/10 dark:border-gold-900/20 transition-colors group"
            >
              <User className="w-4 h-4 text-gold-600 mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] text-gold-700 dark:text-gold-600 font-bold">CLIENT</span>
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};