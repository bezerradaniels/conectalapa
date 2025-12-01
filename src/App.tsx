import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { CompanyForm } from './pages/CompanyForm';
import { EventForm } from './pages/EventForm';
import { JobForm } from './pages/JobForm';
import { TravelPackageForm } from './pages/TravelPackageForm';
import { FoodForm } from './pages/FoodForm';
import { CompaniesList } from './pages/CompaniesList';
import { JobsList } from './pages/JobsList';
import { TravelPackagesList } from './pages/TravelPackagesList';
import { EventsList } from './pages/EventsList';
import { FoodsList } from './pages/FoodsList';
import { Terms } from './pages/Terms';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';

function AppRoutes() {
  const { profile, signOut, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <p className="text-[var(--color-neutral-500)]">Carregando...</p>
        </div>
      </div>
    );
  }

  const user = profile ? { name: profile.name, role: profile.role } : null;

  return (
    <Routes>
      {/* Auth Routes (without sidebar) */}
      <Route path="/login" element={profile ? <Navigate to="/" /> : <Login />} />
      <Route path="/cadastro" element={profile ? <Navigate to="/" /> : <Signup />} />
      <Route path="/termos" element={<Terms />} />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/login" 
        element={profile?.role === 'admin' ? <Navigate to="/admin/painel" /> : <AdminLogin />} 
      />
      <Route
        path="/admin/painel"
        element={
          profile?.role === 'admin' ? (
            <MainLayout user={user} onLogout={signOut}>
              <AdminDashboard />
            </MainLayout>
          ) : (
            <Navigate to="/admin/login" />
          )
        }
      />

      {/* Main Routes (with sidebar) */}
      <Route
        path="/"
        element={
          <MainLayout user={user} onLogout={signOut}>
            <Home />
          </MainLayout>
        }
      />

      <Route
        path="/painel"
        element={
          user ? (
            <MainLayout user={user} onLogout={signOut}>
              <Dashboard isAdmin={user.role === 'admin'} />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/empresa/cadastrar"
        element={
          user ? (
            <MainLayout user={user} onLogout={signOut}>
              <CompanyForm />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/evento/cadastrar"
        element={
          user ? (
            <MainLayout user={user} onLogout={signOut}>
              <EventForm />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/vaga/cadastrar"
        element={
          user ? (
            <MainLayout user={user} onLogout={signOut}>
              <JobForm />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/pacote/cadastrar"
        element={
          user ? (
            <MainLayout user={user} onLogout={signOut}>
              <TravelPackageForm />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/alimentacao/cadastrar"
        element={
          user ? (
            <MainLayout user={user} onLogout={signOut}>
              <FoodForm />
            </MainLayout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Public Listing Routes */}
      <Route
        path="/empresas"
        element={
          <MainLayout user={user} onLogout={signOut}>
            <CompaniesList />
          </MainLayout>
        }
      />

      <Route
        path="/vagas"
        element={
          <MainLayout user={user} onLogout={signOut}>
            <JobsList />
          </MainLayout>
        }
      />

      <Route
        path="/pacotes"
        element={
          <MainLayout user={user} onLogout={signOut}>
            <TravelPackagesList />
          </MainLayout>
        }
      />

      <Route
        path="/eventos"
        element={
          <MainLayout user={user} onLogout={signOut}>
            <EventsList />
          </MainLayout>
        }
      />

      <Route
        path="/alimentacao"
        element={
          <MainLayout user={user} onLogout={signOut}>
            <FoodsList />
          </MainLayout>
        }
      />

      <Route
        path="/anuncie"
        element={
          <MainLayout user={user} onLogout={signOut}>
            <div className="max-w-[1140px] mx-auto py-8 px-6">
              <h1 className="text-3xl font-bold">Anuncie</h1>
              <p className="text-[var(--color-neutral-500)] mt-2">Em desenvolvimento...</p>
            </div>
          </MainLayout>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
