export function MapsAPI() {
  const apiKey = 'AIzaSyAWggmxnep1wqmo8PlO0B8bKURkECp3D9U';
  const zoom = '13';

  const getUrl = (coordinates) => {
    return (
      'https://www.google.com/maps/embed/v1/view?key=' +
      apiKey +
      '&center=' +
      coordinates +
      '&zoom=' +
      zoom
    );
  };

  const getMap = (coordinates) => {
    const mapFrame = document.createElement('iframe');
    mapFrame.referrerPolicy = 'no-referrer-when-downgrade';
    mapFrame.src = getUrl(coordinates);

    return mapFrame;
  };

  return {
    getMap,
  };
}
