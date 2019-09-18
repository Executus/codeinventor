update tbl_behaviour_def
set s_script = 'class BehaviourSprite {
  constructor(owner) {
    this.name = ''Sprite'';
    this.properties = [];
    this.attachedObject = owner;

    // Declare properties here.
    this.Width = new PropertyFloat(''Width (pixels)'', 300);
    this.Height = new PropertyFloat(''Height (pixels)'', 300);
    this.Texture = new PropertyFile(''Texture'', Constants.FiletypeImage);
    this.image = null;
    this.imageLoaded = false;
    
    // Properties added to ''this.properties'' will show up in the Editor.
    this.properties.push(this.Width);
    this.properties.push(this.Height);
    this.properties.push(this.Texture);
  }

  init(runtimeService) {
    // Code here will run once when the object is created.
    this.tex = null;
    this.vertices = [];
    this.positionBuffer = null;
    this.texcoordBuffer = null;
    
    let self = this;
    let gl = runtimeService.getGlContext();

    // Position buffer
    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    let positions = [
      0, 0,
      0, 1,
      1, 0,
      1, 0,
      0, 1,
      1, 1,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Texcoord buffer
    this.texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);

    let texcoords = [
      0, 0,   // Top left
      0, 1,   // Bottom left
      1, 1,   // Bottom right
      1, 1,   // Bottom right
      1, 0,   // Top right
      0, 0,   // Top left
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

    // Texture
    this.tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                  new Uint8Array([0, 0, 255, 255]));

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    
    this.image = new Image();
    this.image.crossOrigin = "";
    this.image.src = ''http://hopper.une.edu.au/codeinventor/files/'' + this.Texture.filename;
    this.image.addEventListener(''load'', function() {
      gl.bindTexture(gl.TEXTURE_2D, self.tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, self.image);
    });
  }

  update(runtimeService) {
    // Code here will run every frame (about 60 times every second).
    let transform = this.attachedObject.getBehaviour(''BehaviourTransform'');
    if (transform) {
      let posX = transform.WorldXPosition;
      let posY = transform.WorldYPosition;

      // Apply size
      let vert1x = -(this.Width.Value / 2); let vert1y = -(this.Height.Value / 2);     // Top left vertex
      let vert2x = -(this.Width.Value / 2); let vert2y =  (this.Height.Value / 2);     // Bottom left vertex
      let vert3x =  (this.Width.Value / 2); let vert3y =  (this.Height.Value / 2);     // Bottom right vertex

      let vert4x =  (this.Width.Value / 2); let vert4y =  (this.Height.Value / 2);     // Bottom right vertex
      let vert5x =  (this.Width.Value / 2); let vert5y = -(this.Height.Value / 2);     // Top right vertex
      let vert6x = -(this.Width.Value / 2); let vert6y = -(this.Height.Value / 2);     // Top left vertex

      // Apply rotation
      let rot = transform.Rotation.Value;
      if (rot !== 0.0) {
        let tanTheta = (this.Height.Value / 2) / (this.Width.Value / 2);
        let theta = Math.atan(tanTheta);

        // Convert to degrees
        theta = theta * (180.0 / Math.PI);

        // Radius from the origin to each vertex should be the same
        let radius = Math.hypot(vert1x, vert1y);

        vert1x = radius * Math.cos(((180 + theta) - rot) * (Math.PI / 180.0)); vert1y = radius * Math.sin(((180 + theta) - rot) * (Math.PI / 180.0));
        vert2x = radius * Math.cos(((180 - theta) - rot) * (Math.PI / 180.0)); vert2y = radius * Math.sin(((180 - theta) - rot) * (Math.PI / 180.0));
        vert3x = radius * Math.cos((theta - rot) * (Math.PI / 180.0)); vert3y = radius * Math.sin((theta - rot) * (Math.PI / 180.0));

        vert4x = radius * Math.cos((theta - rot) * (Math.PI / 180.0)); vert4y = radius * Math.sin((theta - rot) * (Math.PI / 180.0));
        vert5x = radius * Math.cos(((360 - theta) - rot) * (Math.PI / 180.0)); vert5y = radius * Math.sin(((360 - theta) - rot) * (Math.PI / 180.0));
        vert6x = radius * Math.cos(((180 + theta) - rot) * (Math.PI / 180.0));         vert6y = radius * Math.sin(((180 + theta) - rot) * (Math.PI / 180.0));
      }

      // Apply translation
      vert1x += posX; vert1y += posY;
      vert2x += posX; vert2y += posY;
      vert3x += posX; vert3y += posY;

      vert4x += posX; vert4y += posY;
      vert5x += posX; vert5y += posY;
      vert6x += posX; vert6y += posY;

      // 2 triangles to make a quad, 3 vertices each
      this.vertices = [
        vert1x, vert1y,     // Top left vertex
        vert2x, vert2y,     // Bottom left vertex
        vert3x, vert3y,     // Bottom right vertex

        vert4x, vert4y,     // Bottom right vertex
        vert5x, vert5y,     // Top right vertex
        vert6x, vert6y,     // Top left vertex
      ];
    }
  }

  onKeyDown(key) {
		// Code here will run when a keyboard ''key'' is pressed down.
		// A BehaviourKeyboard must be attached to the object.
		
	}

  onKeyUp(key) {
		// Code here will run when a keyboard ''key'' is released.
		// A BehaviourKeyboard must be attached to the object.
		
	}

  draw(runtimeService) {
    // Advanced use - rendering specific code. Runs every frame after update.
		// Most people will not need to write any code here.
    let gl = runtimeService.getGlContext();

    if (gl === null) {
      return;
    }

    let programInfo = runtimeService.getShaderProgramInfo();

    gl.bindTexture(gl.TEXTURE_2D, this.tex);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    let size = 2;               // 2 components per iteration
    let type = gl.FLOAT;        // the data is 32bit floats
    let normalize = false;      // don''t normalize the data
    let stride = 0;             // 0 = move forward size * sizeof(type) each iteration to get the next position
    let offset = 0;             // start at the beginning of the buffer

    gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, size, type, normalize, stride, offset);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texcoordBuffer);
    gl.enableVertexAttribArray(programInfo.attribLocations.texcoordPosition);
    gl.vertexAttribPointer(programInfo.attribLocations.texcoordPosition, size, type, normalize, stride, offset);

    gl.uniform2f(programInfo.uniformLocations.resolutionPosition, gl.canvas.width, gl.canvas.height);
    gl.uniform1i(programInfo.uniformLocations.texturePosition, 0);

    let primitiveType = gl.TRIANGLES;
    let drawOffset = 0;
    let count = 6;
    gl.drawArrays(primitiveType, drawOffset, count);
  }

  getAttachedObject() {
    return this.attachedObject;
  }
}'
where s_name = 'Sprite';