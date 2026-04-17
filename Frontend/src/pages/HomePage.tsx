import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import Button from '../components/Button';

export default function HomePage() {
  return (
    <main>
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Experience Fine Dining<br />
            <span className="text-orange-500">at its Best</span>
          </h1>
          <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
            Discover our seasonal menu crafted by world-class chefs. Reserve your table today and
            enjoy an unforgettable dining experience.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to={ROUTES.RESERVATIONS}>
              <Button size="lg">Reserve a Table</Button>
            </Link>
            <Link to={ROUTES.MENU}>
              <Button variant="secondary" size="lg">View Menu</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: '🍽️', title: 'Seasonal Menu', desc: 'Fresh ingredients, thoughtfully prepared and beautifully presented.' },
            { icon: '📅', title: 'Easy Reservations', desc: 'Book a table in seconds. We\'ll confirm your reservation right away.' },
            { icon: '⭐', title: 'Award-Winning', desc: 'Recognized for excellence in cuisine and hospitality.' },
          ].map((item) => (
            <div key={item.title} className="text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
