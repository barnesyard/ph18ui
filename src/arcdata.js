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
      { "descriptor": "Sight (eye)",
        "dimension": "sight",
        "icon": eyeImg,
      },
      { "descriptor" : "Things and ideas (hourglass)",
        "dimension": "things and ideas",
        "icon": hourglassImg,
      },
      { "descriptor" : "Shadow and substance (figure)",
        "dimension": "shadow and substance",
        "icon": dummyImg,
      },
      { "descriptor" : "Sound (window)",
        "dimension": "sound",
        "icon": windowsImg,
      },
      { "descriptor" : "Space (funnel)",
        "dimension": "space",
        "icon": funnelImg,
      },
      { "descriptor" : "Mind (E=mc^2)",
      "dimension": "mind",
      "icon": emc2Img,
      },
      { "descriptor" : "Reality (door)",
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
