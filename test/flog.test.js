describe('flog', function () {
  beforeEach(function () {
    this.flog = flog.create();
  });
  afterEach(function () {
    delete this.flog;
  });

  it('should be an object', function () {
    expect(flog).to.be.an('object');
  });

  it('should have a default level of quiet', function () {
    expect(flog.level).to.be('quiet');
  });

  describe('#create()', function () {
    it('should return an instance of flog', function () {
      expect(flog.create()).to.be.an('object');
    });

    it('should have flog as its prototype', function () {
      expect(flog.isPrototypeOf(flog.create())).to.be(true);
    });

    it('should have the same level to start', function () {
      expect(this.flog.log).to.be(flog.log);
      expect(this.flog.info).to.be(flog.info);
      expect(this.flog.warn).to.be(flog.warn);
      expect(this.flog.error).to.be(flog.error);
    });

    it ('should set the level if a value was passed', function () {
      var myFlog = flog.create('info');
      expect(myFlog.level).to.be('info');
      expect(flog.level).to.be('quiet');

    });
  });

  describe('#setLevel()', function () {
    it('should set the level', function () {
      this.flog.setLevel('warn');
      expect(this.flog.level).to.be('warn');
    });

    it('should set valid values', function () {
      var levels = ['debug', 'info', 'warn', 'error', 'quiet'],
          i = 0;
      for (; i < levels.length; i++) {
        this.flog.setLevel(levels[i]);
        expect(this.flog.level).to.be(levels[i]);
      }
    });

    it('should not set invalid values', function () {
      var levels = ['foo', 'bar', 'baz'],
          i = 0;
      for (; i < levels.length; i++) {
        this.flog.setLevel(levels[i]);
        expect(this.flog.level).to.not.be(levels[i]);
      }
    });

    it('should allow "debug" and "quiet" aliases "all" and "silent"', function () {
      expect(this.flog.setLevel('all').level).to.be('debug');
      expect(this.flog.setLevel('silent').level).to.be('quiet');
    });

    it('should set the level to "quiet" if the level value is not recognised', function () {
      var levels = ['foo', 'bar', 'baz'],
          i = 0;
      for (; i < levels.length; i++) {
        this.flog.setLevel(levels[i]);
        expect(this.flog.level).to.be('quiet');
      }
    });
  });
});
