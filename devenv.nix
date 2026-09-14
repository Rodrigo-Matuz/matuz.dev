{ pkgs, ... }:

{
  # JavaScript / TypeScript development environment.
  languages.javascript = {
    enable = true;

    # Vite currently requires Node.js 20.19+ or 22.12+.
    # Bun is our package manager, but keeping Node available gives
    # the frontend toolchain a compatible Node runtime as well.
    nodejs.enable = true;

    # Bun is the package manager/runtime used by this project.
    bun.enable = true;

    # TypeScript / JavaScript language server.
    lsp.enable = true;
  };

  # General project tooling.
  packages = [
    pkgs.git
  ];

  enterShell = ''
    echo "matuz.dev development environment"
    echo "  bun:  $(bun --version)"
    echo "  node: $(node --version)"
    echo "  git:  $(git --version | cut -d' ' -f3)"
  '';

  # Git hooks managed by devenv (installed automatically when entering the shell).
  #
  # - eslint: lint on every commit (fast feedback)
  # - vitest: full test suite on every push (slower, so pre-push keeps commits snappy)
  git-hooks.hooks = {
    eslint = {
      enable = true;
      name = "eslint";
      description = "Lint changes with ESLint";
      entry = "bun run lint";
      language = "system";
      pass_filenames = false;
    };

    vitest = {
      enable = true;
      name = "vitest";
      description = "Run the test suite before pushing";
      entry = "bun run test";
      language = "system";
      pass_filenames = false;
      stages = [ "pre-push" ];
    };
  };
}
