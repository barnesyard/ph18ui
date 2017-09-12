import dummyImg from './assets/img/figure.svg';
import hourglassImg from './assets/img/hourglass.svg';
import emc2Img from './assets/img/emc2.svg';
import eyeImg from './assets/img/eye.svg';
import windowsImg from './assets/img/window.svg';
import funnelImg from './assets/img/funnel.svg';
import doorImg from './assets/svg/door.svg';

class ArcData {
  constructor() {
    this.arcDataArray = [ 
      { "descriptor": "sight (eye)",
        "dimension": "sight",
        "icon": eyeImg,
      },
      { "descriptor" : "things and ideas (hourglass)",
        "dimension": "things and ideas",
        "icon": hourglassImg,
      },
      { "descriptor" : "shadow and substance (figure)",
        "dimension": "shadow and substance",
        "icon": dummyImg,
      },
      { "descriptor" : "sound (window)",
        "dimension": "sound",
        "icon": windowsImg,
      },
      { "descriptor" : "space (funnel)",
        "dimension": "space",
        "icon": funnelImg,
      },
      { "descriptor" : "mind (e=mc^2)",
      "dimension": "mind",
      "icon": emc2Img,
      },
      { "descriptor" : "reality (door)",
      "dimension": "reality",
      "icon": doorImg,
      },

    ];
  }

  getArcData() {
    return this.arcDataArray;
  }
}

export { ArcData };
