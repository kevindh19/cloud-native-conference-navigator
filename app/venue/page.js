import styles from './venue.module.css';

const venueMapUrl =
  'https://events.linuxfoundation.org/wp-content/uploads/2026/10/KCNA26-VenueMap-118x96-3.pdf';
const accessibilityUrl =
  'https://events.linuxfoundation.org/kubecon-cloudnativecon-north-america/attend/inclusion-accessibility/';

const rooms = [
  {
    name: 'Hall DE',
    level: 'Level 1',
    area: 'Keynote hall near the 200 South main entrance and badge pick-up.',
  },
  {
    name: 'Grand Ballroom ACE',
    level: 'Level 1',
    area: 'Grand Ballroom area beside the lower concourse.',
  },
  {
    name: 'Grand Ballroom BDF',
    level: 'Level 1',
    area: 'Grand Ballroom area beside the lower concourse.',
  },
  {
    name: 'Grand Ballroom H',
    level: 'Level 1',
    area: 'Grand Ballroom area beside the lower concourse.',
  },
  {
    name: '151',
    level: 'Level 1',
    area: 'Meeting room beside the North Foyer.',
  },
  {
    name: '255 BC',
    level: 'Level 2',
    area: 'Meeting room 255 beside the upper mezzanine.',
  },
  {
    name: '255 EF',
    level: 'Level 2',
    area: 'Meeting room 255 beside the upper mezzanine.',
  },
];

export const metadata = {
  title: 'Venue guide | Conference Navigator',
  description: 'Find rooms in the Salt Palace using the official conference map.',
};

export default async function VenuePage({ searchParams }) {
  const params = await searchParams;
  const requestedRoom = typeof params?.room === 'string' ? params.room : '';
  const selectedRoom = rooms.find(
    (room) => room.name.toLowerCase() === requestedRoom.trim().toLowerCase(),
  );

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <a className={styles.back} href="/">
          ← Back to talk search
        </a>

        <header className={styles.header}>
          <p className={styles.eyebrow}>KubeCon + CloudNativeCon · Salt Lake City</p>
          <h1>Find your room</h1>
          <p>
            Use the official venue map to find conference rooms at the Salt Palace.
          </p>
        </header>

        <div className={styles.layout}>
          <nav className={styles.roomList} aria-label="Conference rooms">
            <h2>Rooms in the first demo</h2>
            <ul>
              {rooms.map((room) => (
                <li key={room.name}>
                  <a
                    className={selectedRoom?.name === room.name ? styles.active : ''}
                    href={`/venue?room=${encodeURIComponent(room.name)}`}
                    aria-current={selectedRoom?.name === room.name ? 'page' : undefined}
                  >
                    <span>{room.name}</span>
                    <span className={styles.roomLevel}>{room.level}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section className={styles.detail} aria-labelledby="room-heading">
            {selectedRoom ? (
              <>
                <p className={styles.label}>Salt Palace · {selectedRoom.level}</p>
                <h2 id="room-heading">{selectedRoom.name}</h2>
                <p>{selectedRoom.area}</p>
              </>
            ) : (
              <>
                <p className={styles.label}>Salt Palace</p>
                <h2 id="room-heading">Select a room</h2>
                <p>Choose a room to see its level and area on the venue map.</p>
              </>
            )}

            <a className={styles.mapLink} href={venueMapUrl} target="_blank" rel="noreferrer">
              Open the official venue map ↗
            </a>

            <div className={styles.accessNote}>
              <h3>Step-free route status</h3>
              <p>
                A step-free route to this room is not verified. The map marks elevators,
                but it does not give a complete route from each entrance.
              </p>
              <p>
                For elevator help, ask event staff at registration or an information desk.
              </p>
              <a href={accessibilityUrl} target="_blank" rel="noreferrer">
                Read the event accessibility guide ↗
              </a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
